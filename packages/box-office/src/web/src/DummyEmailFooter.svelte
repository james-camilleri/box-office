<script lang="ts">
  export let receiptNumber: string = '0000-0000'
</script>

<table class="footer" role="presentation" border={0} cellpadding="0" cellspacing="0">
  <tr>
    <td class="content-block first">
      online ticketing by <a href="https://thegods.mt">the gods</a>
    </td>
  </tr>
  <tr>
    <td class="content-block">
      Name Surname<br />
      VAT# -------- / EXO# -----<br />
      Address
    </td>
  </tr>
  <tr>
    <td class="content-block">
      receipt #{receiptNumber}
    </td>
  </tr>
</table>

<style lang="scss">
  .first {
    padding-top: 30px;
  }

  .content-block {
    width: 100%;
    padding-top: 10px;
    padding-bottom: 10px;
  }

  .footer {
    width: 100%;
    margin-top: 10px;
    clear: both;
    text-align: center;
    border-top: 2px solid #fff;
  }
</style>
