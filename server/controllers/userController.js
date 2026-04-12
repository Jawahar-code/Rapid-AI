import sql from "../configs/db.js";


export const getUserCreations = async (req, res) => {
    try {
        const { userId } = req.auth();

        const creations = await sql`SELECT * FROM creations WHERE user_id = ${userId} ORDER BY created_at DESC`

        res.json({ success: true, creations })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

export const getPublishedCreations = async (req, res) => {
    try {
        const creations = await sql`SELECT * FROM creations WHERE is_published = true ORDER BY created_at DESC`
        res.json({ success: true, creations })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

export const toggleLikeCreation = async (req, res) => {
    try {
        const { id } = req.body;
        const { userId } = req.auth();

        const [creation] = await sql`SELECT * FROM creations WHERE id = ${id}`

        if (!creation) {
            return res.json({ success: false, message: "Creation not found" })
        }

        const likes = creation.likes || []
        const isLiked = likes.includes(userId)

        let newLikes;
        let message;

        if (isLiked) {
            newLikes = likes.filter((uid) => uid !== userId)
            message = "Unliked"
        } else {
            newLikes = [...likes, userId]
            message = "Liked"
        }

        await sql`UPDATE creations SET likes = ${newLikes} WHERE id = ${id}`

        res.json({ success: true, message });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}