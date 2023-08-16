import { AddIcon, CopyIcon } from '@sanity/icons'
import { Button, Card, Flex, Grid, TextInput, useToast } from '@sanity/ui'
import { customAlphabet } from 'nanoid'
import { useState } from 'react'
import { set, ObjectInputProps, useFormValue, useDocumentOperation, useClient } from 'sanity'

import { API_VERSION } from '$shared/constants'

import { DiscountCode } from './DiscountCode.jsx'

interface SingleUseDiscountCode {
  _key: string
  code: string
  used: boolean
}

type SingleUseDiscountCodesInputProps = ObjectInputProps<SingleUseDiscountCode[]>

const DISCOUNT_CODE_ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const generateSuffix = customAlphabet(DISCOUNT_CODE_ALPHABET, 6)

function generateSingleUseCodes(
  baseCode: string,
  numberOfCodes: number,
  existingCodes: SingleUseDiscountCode[],
): SingleUseDiscountCode[] {
  const numberOfExistingCodes = existingCodes.length
  const totalCodes = numberOfExistingCodes + numberOfCodes
  const codes = new Set(existingCodes.map(({ code }) => code))

  while (codes.size < totalCodes) {
    codes.add(`${baseCode}_${generateSuffix()}`)
  }

  return [...codes.values()].slice(numberOfExistingCodes).map((code) => ({
    _key: code,
    code,
    used: false,
  }))
}

export const SingleUseDiscountCodesInput = (props: SingleUseDiscountCodesInputProps) => {
  const { onChange, value = [] } = props

  const [codesToGenerate, setCodesToGenerate] = useState(1)
  const baseCode = useFormValue(['code', 'current']) as string
  const _id = (useFormValue(['_id']) as string).replace('drafts.', '')
  const { publish } = useDocumentOperation(_id, 'discount')
  const client = useClient({ apiVersion: API_VERSION })
  const toast = useToast()

  const addDiscountCodes = async () => {
    onChange(set([...value, ...generateSingleUseCodes(baseCode, codesToGenerate, value)]))

    // Publish changes immediately if document has been previously published.
    if (await client.getDocument(_id)) {
      publish.execute()
    }
  }

  const invalidate = async (code: string) => {
    onChange(
      set(
        value.map((discount) => {
          if (discount.code === code) {
            return {
              ...discount,
              used: true,
            }
          }

          return discount
        }),
      ),
    )

    // Publish changes immediately if document has been previously published.
    if (await client.getDocument(_id)) {
      publish.execute()
    }
  }

  const usedCodes = value.reduce((count, discount) => count + (discount.used ? 1 : 0), 0)

  return (
    <Grid marginTop={[2]}>
      <Flex gap={[3, 2]} align="center">
        <Flex direction="column" style={{ flexGrow: 1 }} marginRight={[3]}>
          <strong>
            {usedCodes}/{value.length} codes used
          </strong>
          <div
            className="discount-progress-bar"
            style={{ ['--progress' as string]: `${(usedCodes / value.length) * 100}%` }}
          />
        </Flex>
        <TextInput
          min={1}
          max={999}
          type="number"
          value={codesToGenerate}
          onChange={(e) => setCodesToGenerate(Number(e.currentTarget.value))}
          size={3}
        />
        <Button
          icon={AddIcon}
          onClick={addDiscountCodes}
          text={`Generate single-use code${codesToGenerate === 1 ? '' : 's'}`}
        />
      </Flex>
      <Card
        className="discount-code-pane"
        radius={2}
        shadow={1}
        paddingRight={[1]}
        marginTop={[4, 3]}
        marginBottom={[4, 3]}
      >
        {value.map((discount) => (
          <DiscountCode
            key={discount.code}
            code={discount.code}
            used={discount.used}
            invalidate={invalidate}
          />
        ))}
      </Card>
      <Button
        tone="primary"
        text="Copy unredeemed codes to clipboard"
        icon={CopyIcon}
        onClick={() => {
          const unusedCodes = value.filter((code) => !code.used).map(({ code }) => code)
          navigator.clipboard.writeText(unusedCodes.join('\n'))
          toast.push({ title: `${unusedCodes.length} codes copied to clipboard` })
        }}
      />
    </Grid>
  )
}
