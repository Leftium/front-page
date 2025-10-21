export const load = (async ({fetch}) => {

    const fetched = await fetch('https://hckrnews.com/data/latest.js')
    const texted = await fetched.text()

    const json = JSON.parse(texted.replace(/^var entries =/, ''))

    return { json };
})