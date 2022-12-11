<script lang="ts">
  import type { SvelteComponent } from 'svelte'

  type Row = Array<any>

  export let data: Row[] = []
  export let header: Row | undefined = undefined
  export let customCells: { [column: number]: typeof SvelteComponent } = {}
</script>

<table>
  {#if header}
    <thead>
      <tr>
        {#each header as column}
          <th>{column}</th>
        {/each}
      </tr>
    </thead>
  {/if}
  <tbody>
    {#each data as row}
      <tr>
        {#each row as column, i}
          <td data-header={header ? header[i] : undefined}>
            {#if customCells[i]}
              <svelte:component this={customCells[i]} {...column} />
            {:else}
              {column}
            {/if}
          </td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>

<style lang="scss">
  @use '../../../styles/breakpoints';

  table {
    width: 100%;
    overflow-wrap: normal;
  }

  th {
    text-align: start;
  }

  // Mobile-first sizing.
  thead {
    // Accessible hide.
    // TODO: This isn't actually super accesible, changing the position/display
    // screws up the accessibility tree. Maybe use a separate table or manually
    // annotate with the aria attributes.
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    white-space: nowrap;
  }

  tr {
    display: grid;
    grid-template-columns: min-content 1fr;
    gap: var(--xs);

    margin-bottom: var(--gutter);
  }

  td {
    display: contents;

    &::before {
      margin-inline-end: var(--md);
      content: attr(data-header);
    }
  }

  // Revert to actual table on larger screens
  @media (min-width: breakpoints.$md) {
    thead {
      position: static;
      clip: none;
      clip-path: none;
    }

    tr {
      display: table-row;
    }

    td {
      display: table-cell;
      white-space: pre;

      &::before {
        content: none;
      }
    }
  }
</style>
