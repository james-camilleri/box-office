import './style.scss'

import { AccessDeniedIcon, CopyIcon } from '@sanity/icons'
import { Card, Flex, useToast } from '@sanity/ui'
import React from 'react'

interface DiscountCodeProps {
  code: string
  used: boolean
  invalidate: (code: string) => void
}

export const DiscountCode = ({ code, used, invalidate }: DiscountCodeProps) => {
  const toast = useToast()

  const copy = () => {
    navigator.clipboard.writeText(code)
    toast.push({ title: `"${code}" copied` })
  }

  return (
    <Card padding={[1, 2]} shadow={1} tone="default" key={code}>
      <Flex justify="space-between" align="center">
        <span
          style={{
            textDecorationLine: used ? 'line-through' : undefined,
            opacity: used ? 0.5 : 1,
          }}
        >
          {code}
        </span>
        <Flex gap={[1, 2]} align="center">
          <span
            className="discount-code-icon"
            title="Invalidate code"
            onClick={() => invalidate(code)}
          >
            <AccessDeniedIcon width="1.5em" height="1.5em" />
          </span>
          <span className="discount-code-icon" title="Copy code to clipboard" onClick={copy}>
            <CopyIcon width="1.5em" height="1.5em" />
          </span>
        </Flex>
      </Flex>
    </Card>
  )
}
