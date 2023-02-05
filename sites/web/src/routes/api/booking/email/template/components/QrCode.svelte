<script lang="ts">
  export let ticketId: string
  export let qrCodeUrl: string | undefined
  export let seat: string

  if (!qrCodeUrl) {
    throw Error(`No QR code found for ticket ${ticketId}`)
  }
</script>

<div class="qr-code">
  <table border={0} cellpadding="0" cellspacing="0">
    <tr>
      <td>
        <div class="seat">{seat}</div>
      </td>
    </tr>
    <tr>
      <td>
        <img src={qrCodeUrl} alt={ticketId} width="600" />
      </td>
    </tr>
    <tr>
      <td>
        <div class="id-wrapper">
          <div class="ticket-number">TICKET NUMBER</div>
          <div class="ticket-id">{ticketId}</div>
        </div>
      </td>
    </tr>
  </table>
</div>

<style>
  .qr-code {
    margin-bottom: 20px;
    text-align: center;
    background: #999;
    border-radius: 3px;
  }

  .seat {
    margin: 20px 0;
    font-size: 1.8em;
    line-height: 20px;
  }

  img {
    max-width: 100%;
  }

  .id-wrapper {
    margin: 20px 0;
  }

  .ticket-number {
    font-size: 1em;
    color: #646464;
  }

  .ticket-id {
    font-size: 1.8em;
  }

  table {
    width: 100%;
    border: solid #000 3px;
  }

  td {
    text-align: center;
    background: #999;
  }
</style>
