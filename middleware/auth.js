const auth = async (req, res, next) => {
    try {
        console.log("Cookies:", req.cookies);
        console.log("Headers Cookie:", req.headers.cookie);

        const token = req.cookies.token;

        console.log("Token:", token);

        if (!token) {
            return res.status(401).json({ message: "unauthorised" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.admin = decoded;
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "internal server error occured" });
    }
};