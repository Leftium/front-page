<script lang="ts">
    let { data } = $props()
</script>

<pre>{JSON.stringify(data.json, null, 4)}</pre>
