import arcjet, { detectBot, shield, tokenBucket } from "@arcjet/next";

export const aj = arcjet({
    key: process.env.NEXT_PUBLIC_ARCJET_KEY,
    rules:[
        shield({
            mode:"LIVE"
        }),
        detectBot({
            mode:"LIVE",
            allow:[
                "CATEGORY:SEARCH_ENGINE",
                "CATEGORY:PREVIEW"
            ]
        })
    ]

})

//free tier pantry scans (limit it to 10 per month)

export const freePantryScans = aj.withRule(
    tokenBucket({
        mode: "LIVE",
        characteristics: ["userId"],
        refillRate: 10,
        interval: "30d",
        capacity: 10
    })
)

//free tier meal reccomendations (5 permonth)

export const freeMealRecommendations = aj.withRule(
    tokenBucket({
        mode: "LIVE",
        characteristics: ["userId"],
        refillRate: 5,
        interval: "30d",
        capacity: 5,
    })
);

//pro tier very high(will say 500)

export const proTierLimit = aj.withRule(
    tokenBucket({
        mode: "LIVE",
        characteristics: ["userId"],
        refillRate: 500,
        interval: "1d",
        capacity: 500,
    })
);

