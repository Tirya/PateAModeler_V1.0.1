module.exports = {
    1	:"α",
    2	:"β",
    3	:"γ",
    4	:"δ",
    5	:"ε",
    6	:"ζ",
    7	:"η",
    8	:"θ",
    9	:"ι",
    10	:"κ",
    11	:"λ",
    12	:"μ",
    13	:"ν",
    14	:"ξ",
    15	:"ο",
    16	:"π",
    17	:"ρ",
    18	:"σ",
    19	:"τ",
    20	:"υ",
    21	:"φ",
    22	:"χ",
    23	:"ψ",
    24	:"ω",
    
    get(i){
        if(i >= 600) return "eRrOr"
        if(i <= 24)
        {
            return this[i]
        }else
        {
            const Deuxieme = i % 24 + 1
            const Premiere = Math.round((i - Deuxieme) / 24)
            return `${this[Premiere]}${this[Deuxieme]}`
        }
    }
};