<script lang="ts">
  import '../styles/reset.css'

  export let title: string
</script>

<html lang="en">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <!-- This throws type errors and might not be needed any more, but emails are weird so check. -->
    <!-- <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /> -->
    <title>{title}</title>
  </head>
  <body>
    <table role="presentation" border={0} cellpadding="0" cellspacing="0" class="body">
      <tr>
        <td>&nbsp;</td>
        <td class="container">
          <div class="content">
            <table role="presentation" class="main">
              <tr>
                <td class="wrapper">
                  <table role="presentation" border={0} cellpadding="0" cellspacing="0">
                    <tr>
                      <td>
                        <slot name="content" />
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <slot name="footer" />
          </div>
        </td>
        <td>&nbsp;</td>
      </tr>
    </table>
  </body>
</html>

<style lang="scss" global>
  @use '../styles/index';

  /* Set a max-width, and make it display as block so it will automatically stretch to that width, but will also shrink down on a phone or something */
  .container {
    display: block;
    width: 580px;
    max-width: 580px;
    padding: 10px;
    margin: 0 auto !important;
  }

  /* This should also be a block element, so that it will fill 100% of the .container */
  .content {
    box-sizing: border-box;
    display: block;
    max-width: 580px;
    padding: 10px;
    margin: 0 auto;
  }

  .main {
    width: 100%;
  }

  .wrapper {
    box-sizing: border-box;
    padding: 20px;
  }
</style>
