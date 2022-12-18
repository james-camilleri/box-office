<!--
  Based on the responsive email template by Lee Munroe:
  https://github.com/leemunroe/responsive-html-email-template
-->
<script lang="ts">
  import EmailWrapper from './components/EmailWrapper.svelte'
  import Footer from './components/Footer.svelte'

  export let event: {
    name: string
    date: string
    time: string
    location: string
    map: string
  }
  export let name: string
  export let tickets: []
</script>

<EmailWrapper title="{event.name}: Tickets" description="Your tickets for {event.name}.">
  <div slot="content">
    <p>Hi there,</p>
    <p>
      Sometimes you just want to send a simple HTML email with a simple design and clear call to
      action. This is it.
    </p>
    <table role="presentation" border={0} cellpadding="0" cellspacing="0" class="btn btn-primary">
      <tbody>
        <tr>
          <td align="left">
            <table role="presentation" border={0} cellpadding="0" cellspacing="0">
              <tbody>
                <tr>
                  <td>
                    <a href="http://htmlemail.io" target="_blank">Call To Action</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
    <p>
      This is a really simple email template. Its sole purpose is to get the recipient to click the
      button with no distractions.
    </p>
    <p>Good luck! Hope it works.</p>
  </div>
  <div slot="footer">
    <Footer />
  </div>
</EmailWrapper>

<style lang="scss">
</style>
