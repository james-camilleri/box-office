<script lang="ts">
  import { tick } from 'svelte'

  import Grid from '$lib/components/layout/Grid.svelte'
  import StateButton, { State, STATE } from '$lib/components/form/StateButton.svelte'
  import Title from '$lib/components/global/Title.svelte'
  import Transition from '$lib/components/transition/Transition.svelte'
  import Fields from '$lib/components/form/Fields.svelte'
  import { EMAIL_REGEX } from '$lib/utils/form'

  const RESET_TIMEOUT = 5000

  let form: HTMLFormElement
  let formState: State
  let submitted

  let fields = [
    {
      name: 'name',
      type: 'text',
      value: '',
      valid: undefined,
    },
    {
      name: 'email',
      type: 'email',
      value: '',
      validations: [(value) => !EMAIL_REGEX.test(value) && 'Enter a valid email address'],
      valid: undefined,
    },
    {
      name: 'subject',
      type: 'text',
      value: '',
      valid: undefined,
    },
    {
      name: 'message',
      type: 'textarea',
      value: '',
      valid: undefined,
    },
  ]

  async function submit(e) {
    e.preventDefault()

    // Stop multiple submissions.
    if (formState === STATE.WAITING) return

    submitted = true
    await tick() // Await validation before attempting submit.
    if (fields.filter(({ valid }) => !valid).length) return

    formState = STATE.WAITING
    const response = await fetch('/contact/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(new FormData(form).entries())),
    })

    formState = response.ok ? STATE.SUCCESS : STATE.ERROR
    setTimeout(() => {
      formState = STATE.IDLE
    }, RESET_TIMEOUT)

    if (response.ok) {
      fields = fields.map((field) => ({ ...field, value: '' }))
      submitted = false
    }
  }
</script>

<Title text="Contact us" />

<div class="grid">
  <Transition order={0}>
    <form bind:this={form} name="contact">
      <Grid>
        <Fields fieldInfo={fields} validate={submitted} />
        <StateButton
          on:click={submit}
          state={formState}
          messages={{
            [STATE.WAITING]: 'Submitting',
            [STATE.ERROR]: 'Error submitting message',
            [STATE.SUCCESS]: 'Submitted',
          }}>Submit</StateButton
        >
      </Grid>
    </form>
  </Transition>
</div>
