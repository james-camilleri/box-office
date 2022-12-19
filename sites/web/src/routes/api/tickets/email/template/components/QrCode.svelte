<script lang="ts">
  export let ticketId: string
  export let qrCodeUrl: string | undefined
  export let seat: {
    section: string
    row: string
    seatNumber: string
  }

  if (!qrCodeUrl) {
    throw Error(`No QR code found for ticket ${ticketId}`)
  }
</script>

<div class="qr-code">
  <div class="seat-details">{seat.section}, Row {seat.row}, seat {seat.seatNumber}</div>
  <img src={qrCodeUrl} alt={ticketId} />
  <div class="ticket-number">TICKET NUMBER</div>
  <div class="ticket-id">{ticketId}</div>
</div>

<style>
  .qr-code {
    padding: 30px 0;
    margin-bottom: 20px;
    text-align: center;
    background: #fff !important;
    border: solid #000 1px;
  }

  .seatDetails {
  }

  img {
    padding: 10px 0;
  }

  .ticket-number {
    font-size: 0.8em;
    color: #646464 !important;
  }

  .ticket-id {
    font-size: 1.6em;
  }
</style>
