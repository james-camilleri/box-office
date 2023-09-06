<script lang="ts">
  import Section from '$lib/components/seatplan/Section.svelte'
  import Row from '$lib/components/seatplan/Row.svelte'
  import Seat from '$lib/components/seatplan/Seat.svelte'

  const SEAT_SIZE = 40
  const AISLE_WIDTH = 120

  const BALCONY_START = 120

  const STALLS_LEFT_START = BALCONY_START + SEAT_SIZE * 4
  const STALLS_CENTRE_START = STALLS_LEFT_START + SEAT_SIZE * 11 + AISLE_WIDTH
  const STALLS_RIGHT_START = STALLS_CENTRE_START + SEAT_SIZE * 18 + AISLE_WIDTH

  const CIRCLE_LEFT_START = BALCONY_START + SEAT_SIZE * 3
  const CIRCLE_CENTRE_START = STALLS_LEFT_START + SEAT_SIZE * 11 + AISLE_WIDTH
  const CIRCLE_RIGHT_START = STALLS_CENTRE_START + SEAT_SIZE * 18 + AISLE_WIDTH

  const BOX_HEIGHT = 170

  function y(row: number) {
    return row * SEAT_SIZE
  }
</script>

<svg viewBox="0 0 2400 2000">
  <Section id="STALLS">
    <g>
      <Row id="A" startFrom={5} seats={7} x={STALLS_LEFT_START + SEAT_SIZE * 4} y={y(1)} />
      <Row id="A" startFrom={12} seats={18} x={STALLS_CENTRE_START} y={y(1)} />
      <Row id="A" startFrom={30} seats={7} x={STALLS_RIGHT_START} y={y(1)} />
    </g>
    <g>
      <Row id="B" startFrom={4} seats={8} x={STALLS_LEFT_START + SEAT_SIZE * 3} y={y(2)} />
      <Row id="B" startFrom={12} seats={18} x={STALLS_CENTRE_START} y={y(2)} />
      <Row id="B" startFrom={30} seats={8} x={STALLS_RIGHT_START} y={y(2)} />
    </g>
    <g>
      <Row id="C" startFrom={3} seats={9} x={STALLS_LEFT_START + SEAT_SIZE * 2} y={y(3)} />
      <Row id="C" startFrom={12} seats={18} x={STALLS_CENTRE_START} y={y(3)} />
      <Row id="C" startFrom={30} seats={9} x={STALLS_RIGHT_START} y={y(3)} />
    </g>
    <g>
      <Row id="D" startFrom={3} seats={9} x={STALLS_LEFT_START + SEAT_SIZE * 2} y={y(4)} />
      <Row id="D" startFrom={12} seats={18} x={STALLS_CENTRE_START} y={y(4)} />
      <Row id="D" startFrom={30} seats={9} x={STALLS_RIGHT_START} y={y(4)} />
    </g>
    <g>
      <Row id="E" startFrom={2} seats={10} x={STALLS_LEFT_START + SEAT_SIZE} y={y(5)} />
      <Row id="E" startFrom={12} seats={18} x={STALLS_CENTRE_START} y={y(5)} />
      <Row id="E" startFrom={30} seats={10} x={STALLS_RIGHT_START} y={y(5)} />
    </g>
    <g>
      <Row id="F" startFrom={2} seats={10} x={STALLS_LEFT_START + SEAT_SIZE} y={y(6)} />
      <Row id="F" startFrom={12} seats={18} x={STALLS_CENTRE_START} y={y(6)} />
      <Row id="F" startFrom={30} seats={10} x={STALLS_RIGHT_START} y={y(6)} />
    </g>
    <g>
      <Row id="G" startFrom={1} seats={11} x={STALLS_LEFT_START} y={y(7)} />
      <Row id="G" startFrom={12} seats={18} x={STALLS_CENTRE_START} y={y(7)} />
      <Row id="G" startFrom={30} seats={11} x={STALLS_RIGHT_START} y={y(7)} />
    </g>
    <g>
      <Row id="H" startFrom={1} seats={11} x={STALLS_LEFT_START} y={y(8)} />
      <Row id="H" startFrom={12} seats={18} x={STALLS_CENTRE_START} y={y(8)} />
      <Row id="H" startFrom={30} seats={11} x={STALLS_RIGHT_START} y={y(8)} />
    </g>
    <g>
      <Row id="I" startFrom={1} seats={11} x={STALLS_LEFT_START} y={y(9)} />
      <Row id="I" startFrom={12} seats={18} x={STALLS_CENTRE_START} y={y(9)} />
      <Row id="I" startFrom={30} seats={11} x={STALLS_RIGHT_START} y={y(9)} />
    </g>
    <g>
      <Row id="J" startFrom={1} seats={11} x={STALLS_LEFT_START} y={y(10)} />
      <Row id="J" startFrom={12} seats={18} x={STALLS_CENTRE_START} y={y(10)} />
      <Row id="J" startFrom={30} seats={11} x={STALLS_RIGHT_START} y={y(10)} />
    </g>
  </Section>

  <Section id="DRESS-CIRCLE" transform="translate(0, {SEAT_SIZE * 10 + AISLE_WIDTH})">
    <g>
      <Row id="A" seats={18} x={CIRCLE_CENTRE_START} y={y(1)} />
    </g>
    <g>
      <Row id="B" startFrom={1} seats={12} x={CIRCLE_LEFT_START} y={y(2)} />
      <Row id="B" startFrom={13} seats={18} x={CIRCLE_CENTRE_START} y={y(2)} />
      <Row id="B" startFrom={31} seats={12} x={CIRCLE_RIGHT_START} y={y(2)} />
    </g>
    <g>
      <Row id="C" startFrom={1} seats={12} x={CIRCLE_LEFT_START} y={y(3)} />
      <Row id="C" startFrom={13} seats={18} x={CIRCLE_CENTRE_START} y={y(3)} />
      <Row id="C" startFrom={31} seats={12} x={CIRCLE_RIGHT_START} y={y(3)} />
    </g>
    <g>
      <Row id="D" startFrom={1} seats={12} x={CIRCLE_LEFT_START} y={y(4)} />
      <Row id="D" startFrom={13} seats={18} x={CIRCLE_CENTRE_START} y={y(4)} />
      <Row id="D" startFrom={31} seats={12} x={CIRCLE_RIGHT_START} y={y(4)} />
    </g>
    <g>
      <Row id="E" startFrom={1} seats={12} x={CIRCLE_LEFT_START} y={y(5)} />
      <Row id="E" startFrom={13} seats={18} x={CIRCLE_CENTRE_START} y={y(5)} />
      <Row id="E" startFrom={31} seats={12} x={CIRCLE_RIGHT_START} y={y(5)} />
    </g>
    <g>
      <Row id="F" startFrom={1} seats={12} x={CIRCLE_LEFT_START} y={y(6)} />
      <Row id="F" startFrom={13} seats={18} x={CIRCLE_CENTRE_START} y={y(6)} />
      <Row id="F" startFrom={31} seats={12} x={CIRCLE_RIGHT_START} y={y(6)} />
    </g>
    <g>
      <Row id="G" startFrom={1} seats={12} x={CIRCLE_LEFT_START} y={y(7)} />
      <Row id="G" startFrom={13} seats={18} x={CIRCLE_CENTRE_START} y={y(7)} />
      <Row id="G" startFrom={31} seats={12} x={CIRCLE_RIGHT_START} y={y(7)} />
    </g>
    <g>
      <Row id="H" startFrom={1} seats={12} x={CIRCLE_LEFT_START} y={y(8)} />
      <Row id="H" startFrom={13} seats={18} x={CIRCLE_CENTRE_START} y={y(8)} />
      <Row id="H" startFrom={31} seats={12} x={CIRCLE_RIGHT_START} y={y(8)} />
    </g>
    <g>
      <Row id="I" startFrom={2} seats={11} x={CIRCLE_LEFT_START + SEAT_SIZE} y={y(9)} />
      <Row id="I" startFrom={13} seats={18} x={CIRCLE_CENTRE_START} y={y(9)} />
      <Row id="I" startFrom={31} seats={11} x={CIRCLE_RIGHT_START} y={y(9)} />
    </g>
    <g>
      <Row id="J" startFrom={2} seats={11} x={CIRCLE_LEFT_START + SEAT_SIZE} y={y(10)} />
      <Row id="J" startFrom={13} seats={18} x={CIRCLE_CENTRE_START} y={y(10)} />
      <Row id="J" startFrom={31} seats={11} x={CIRCLE_RIGHT_START} y={y(10)} />
    </g>
    <g>
      <Row id="K" startFrom={2} seats={11} x={CIRCLE_LEFT_START + SEAT_SIZE} y={y(11)} />
      <Row id="K" startFrom={13} seats={18} x={CIRCLE_CENTRE_START} y={y(11)} />
      <Row id="K" startFrom={31} seats={11} x={CIRCLE_RIGHT_START} y={y(11)} />
    </g>
    <g>
      <Row id="L" startFrom={2} seats={11} x={CIRCLE_LEFT_START + SEAT_SIZE} y={y(12)} />
      <Row id="L" startFrom={13} seats={18} x={CIRCLE_CENTRE_START} y={y(12)} />
      <Row id="L" startFrom={31} seats={11} x={CIRCLE_RIGHT_START} y={y(12)} />
    </g>
    <g>
      <Row id="M" startFrom={2} seats={11} x={CIRCLE_LEFT_START + SEAT_SIZE} y={y(13)} />
      <Row id="M" startFrom={13} seats={18} x={CIRCLE_CENTRE_START} y={y(13)} />
      <Row id="M" startFrom={31} seats={11} x={CIRCLE_RIGHT_START} y={y(13)} />
    </g>
    <g>
      <Row id="N" startFrom={2} seats={11} x={CIRCLE_LEFT_START + SEAT_SIZE} y={y(14)} />
      <Row id="N" startFrom={13} seats={18} x={CIRCLE_CENTRE_START} y={y(14)} />
      <Row id="N" startFrom={31} seats={11} x={CIRCLE_RIGHT_START} y={y(14)} />
    </g>
    <g>
      <Row id="O" startFrom={2} seats={11} x={CIRCLE_LEFT_START + SEAT_SIZE} y={y(15)} />
      <Row id="O" startFrom={13} seats={18} x={CIRCLE_CENTRE_START} y={y(15)} />
      <Row id="O" startFrom={31} seats={11} x={CIRCLE_RIGHT_START} y={y(15)} />
    </g>
    <g>
      <Row id="P" startFrom={2} seats={11} x={CIRCLE_LEFT_START + SEAT_SIZE} y={y(16)} />
      <Row id="P" startFrom={13} seats={18} x={CIRCLE_CENTRE_START} y={y(16)} />
      <Row id="P" startFrom={31} seats={11} x={CIRCLE_RIGHT_START} y={y(16)} />
    </g>
    <g>
      <Row id="Q" startFrom={2} seats={11} x={CIRCLE_LEFT_START + SEAT_SIZE} y={y(17)} />
      <Row id="Q" startFrom={13} seats={18} x={CIRCLE_CENTRE_START} y={y(17)} />
      <Row id="Q" startFrom={31} seats={11} x={CIRCLE_RIGHT_START} y={y(17)} />
    </g>
  </Section>

  <Section id="BALCONY" transform="translate(0, {SEAT_SIZE * 27 + AISLE_WIDTH * 2})">
    <g>
      <Row id="A" startFrom={4} seats={2} x={BALCONY_START + SEAT_SIZE * 2} y={y(1)} />
      <Row
        id="A"
        startFrom={6}
        seats={19}
        x={BALCONY_START + SEAT_SIZE * 4 + AISLE_WIDTH}
        y={y(1)}
      />
      <Row
        id="A"
        startFrom={25}
        seats={15}
        x={BALCONY_START + SEAT_SIZE * 23 + AISLE_WIDTH * 2}
        y={y(1)}
      />
      <Row
        id="A"
        startFrom={40}
        seats={6}
        x={BALCONY_START + SEAT_SIZE * 38 + AISLE_WIDTH * 3}
        y={y(1)}
      />
    </g>
    <g>
      <Row id="B" startFrom={3} seats={3} x={BALCONY_START + SEAT_SIZE} y={y(2)} />
      <Row
        id="B"
        startFrom={6}
        seats={19}
        x={BALCONY_START + SEAT_SIZE * 4 + AISLE_WIDTH}
        y={y(2)}
      />
      <Row
        id="B"
        startFrom={25}
        seats={15}
        x={BALCONY_START + SEAT_SIZE * 23 + AISLE_WIDTH * 2}
        y={y(2)}
      />
      <Row
        id="B"
        startFrom={40}
        seats={7}
        x={BALCONY_START + SEAT_SIZE * 38 + AISLE_WIDTH * 3}
        y={y(2)}
      />
    </g>
    <g>
      <Row id="C" startFrom={2} seats={4} x={BALCONY_START} y={y(3)} />
      <Row
        id="C"
        startFrom={6}
        seats={19}
        x={BALCONY_START + SEAT_SIZE * 4 + AISLE_WIDTH}
        y={y(3)}
      />
      <Row
        id="C"
        startFrom={25}
        seats={15}
        x={BALCONY_START + SEAT_SIZE * 23 + AISLE_WIDTH * 2}
        y={y(3)}
      />
      <Row
        id="C"
        startFrom={40}
        seats={8}
        x={BALCONY_START + SEAT_SIZE * 38 + AISLE_WIDTH * 3}
        y={y(3)}
      />
    </g>

    <g>
      <Row id="D" startFrom={1} seats={5} x={BALCONY_START} y={y(4) + AISLE_WIDTH / 2} />
      <Row
        id="D"
        startFrom={6}
        seats={17}
        x={BALCONY_START + SEAT_SIZE * 5 + AISLE_WIDTH}
        y={y(4) + AISLE_WIDTH / 2}
      />
      <Row
        id="D"
        startFrom={23}
        seats={14}
        x={BALCONY_START + SEAT_SIZE * 21 + AISLE_WIDTH * 3}
        y={y(4) + AISLE_WIDTH / 2}
      />
      <Row
        id="D"
        startFrom={37}
        seats={9}
        x={BALCONY_START + SEAT_SIZE * 35 + AISLE_WIDTH * 4}
        y={y(4) + AISLE_WIDTH / 2}
      />
    </g>
    <g>
      <Row id="E" startFrom={1} seats={5} x={BALCONY_START} y={y(5) + AISLE_WIDTH / 2} />
      <Row
        id="E"
        startFrom={6}
        seats={17}
        x={BALCONY_START + SEAT_SIZE * 5 + AISLE_WIDTH}
        y={y(5) + AISLE_WIDTH / 2}
      />
      <Row
        id="E"
        startFrom={23}
        seats={14}
        x={BALCONY_START + SEAT_SIZE * 21 + AISLE_WIDTH * 3}
        y={y(5) + AISLE_WIDTH / 2}
      />
      <Row
        id="E"
        startFrom={37}
        seats={9}
        x={BALCONY_START + SEAT_SIZE * 35 + AISLE_WIDTH * 4}
        y={y(5) + AISLE_WIDTH / 2}
      />
    </g>
    <g>
      <Row id="F" startFrom={1} seats={5} x={BALCONY_START} y={y(6) + AISLE_WIDTH / 2} />
      <Row
        id="F"
        startFrom={6}
        seats={17}
        x={BALCONY_START + SEAT_SIZE * 5 + AISLE_WIDTH}
        y={y(6) + AISLE_WIDTH / 2}
      />
      <Row
        id="F"
        startFrom={23}
        seats={14}
        x={BALCONY_START + SEAT_SIZE * 21 + AISLE_WIDTH * 3}
        y={y(6) + AISLE_WIDTH / 2}
      />
      <Row
        id="F"
        startFrom={37}
        seats={9}
        x={BALCONY_START + SEAT_SIZE * 35 + AISLE_WIDTH * 4}
        y={y(6) + AISLE_WIDTH / 2}
      />
    </g>
  </Section>

  <Section id="BOX" transform="translate(0, 400)">
    {#each Array(5).fill(0) as _, i}
      <rect
        x="0"
        y={BOX_HEIGHT * i}
        width="100"
        height={BOX_HEIGHT}
        stroke-width="1"
        fill="none"
        stroke="var(--dark-1)"
      />
      <Row id={(i + 3).toString()} seats={[]}>
        <Seat number={1} x={SEAT_SIZE * 1.8} y={BOX_HEIGHT * i + SEAT_SIZE * 1.5 + 5} />
        <Seat number={2} x={SEAT_SIZE * 1.8} y={BOX_HEIGHT * i + SEAT_SIZE * 2.5 + 5} />
        <Seat number={3} x={SEAT_SIZE * 0.9} y={BOX_HEIGHT * i + SEAT_SIZE * 1 + 5} />
        <Seat number={4} x={SEAT_SIZE * 0.9} y={BOX_HEIGHT * i + SEAT_SIZE * 2 + 5} />
        <Seat number={5} x={SEAT_SIZE * 0.9} y={BOX_HEIGHT * i + SEAT_SIZE * 3 + 5} />
      </Row>
    {/each}
  </Section>
  <Section id="BOX" transform="translate(2250, 400)">
    {#each Array(5).fill(0) as _, i}
      <rect
        x="0"
        y={BOX_HEIGHT * i}
        width="100"
        height={BOX_HEIGHT}
        stroke-width="1"
        fill="none"
        stroke="var(--dark-1)"
      />
      <Row id={(12 - i).toString()} seats={[]}>
        <Seat number={1} x={SEAT_SIZE * 0.9} y={BOX_HEIGHT * i + SEAT_SIZE * 1.5 + 5} />
        <Seat number={2} x={SEAT_SIZE * 0.9} y={BOX_HEIGHT * i + SEAT_SIZE * 2.5 + 5} />
        <Seat number={3} x={SEAT_SIZE * 1.8} y={BOX_HEIGHT * i + SEAT_SIZE * 1 + 5} />
        <Seat number={4} x={SEAT_SIZE * 1.8} y={BOX_HEIGHT * i + SEAT_SIZE * 2 + 5} />
        <Seat number={5} x={SEAT_SIZE * 1.8} y={BOX_HEIGHT * i + SEAT_SIZE * 3 + 5} />
      </Row>
    {/each}
  </Section>
</svg>
