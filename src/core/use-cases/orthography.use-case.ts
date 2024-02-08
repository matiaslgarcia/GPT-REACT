import type { OrthographyResponse } from "../../interfaces/orthography.interface"

export const orthographyUseCase = async (prompt: string) => {
    try {

        const resp = await fetch(`${import.meta.env.VITE_GPT_API}/orthography-check`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ prompt })
        })

        if (!resp.ok) throw new Error('No se pudo realizar la correccion')

        const data = resp.json() as OrthographyResponse

    } catch (error) {
        return {
            ok: false,
            userScore: 0,
            errors: [],
            message: 'No se pudo realizar la correcion'
        }
    }
}