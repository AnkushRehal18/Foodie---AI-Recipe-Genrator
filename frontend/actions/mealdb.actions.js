"use server";

const MEAL_DB_BASE = "https://www.themealdb.com/api/json/v1/1"


export async function getRecipeOfTheDay() {
    try {
        const res = await fetch(`{MEAL_DB_BASE}/random.php`, {
            next: { revalidate: 86400 } //cache for 24 hours
        })

        if (!res.ok) {
            throw new Error("Failed to fetch recipe of the day ")
        }

        const data = await res.json();

        return {
            success: true,
            recipe: data.meals[0],
        }
    } catch (err) {
        console.log("Error fetching reciep of the day ", err)
        throw new Error(err.message || "Failed to load recipe")
    }
}

export async function getCategories() {
    try {
        const res = await fetch(`{MEAL_DB_BASE}/list.php?c=list`, {
            next: { revalidate: 604800 } //cache for 1 week 
        })

        if (!res.ok) {
            throw new Error("Failed to fetch categories ")
        }

        const data = await res.json();

        return {
            success: true,
            categories: data.meals || [],
        }
    } catch (err) {
        console.log("Error fetching categories ", err)
        throw new Error(err.message || "Failed to load categories")
    }
}

export async function getAread() {
    try {
        const res = await fetch(`{MEAL_DB_BASE}/list.php?a=list`, {
            next: { revalidate: 604800 } //cache for 1 week 
        })

        if (!res.ok) {
            throw new Error("Failed to fetch areas ")
        }

        const data = await res.json();

        return {
            success: true,
            areas: data.meals || [],
        }
    } catch (err) {
        console.log("Error fetching areas ", err)
        throw new Error(err.message || "Failed to load areas")
    }
}

export async function getMealsByCategory(category) {
    try {
        const res = await fetch(`{MEAL_DB_BASE}/filter.php?c=${category}`, {
            next: { revalidate: 86400 } //cache for 24 hours
        })

        if (!res.ok) {
            throw new Error("Failed to fetch meals ")
        }

        const data = await res.json();

        return {
            success: true,
            meals: data.meals || [],
            category
        }
    } catch (err) {
        console.log("Error fetching meals category ", err)
        throw new Error(err.message || "Failed to load meals category")
    }
}

export async function getMealsByArea(area) {
    try {
        const res = await fetch(`{MEAL_DB_BASE}/filter.php?a=${area}`, {
            next: { revalidate: 86400 } //cache for 24 hours
        })

        if (!res.ok) {
            throw new Error("Failed to fetch meals ")
        }

        const data = await res.json();

        return {
            success: true,
            meals: data.meals || [],
            area
        }
    } catch (err) {
        console.log("Error fetching meals area ", err)
        throw new Error(err.message || "Failed to load area")
    }
}