import admin from "../config/firebaseAdmin.js";
export const firebaseAuth = async (req, res, next) => {
  try {
    let token = null;
    
    const authHeader = req.headers.authorization;
   
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } 
    else if (req.body && req.body.token) {
      token = req.body.token;
    }
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: "No token provided" 
      });
    }
    
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
    
  } catch (error) {
    console.error("   Error message:", error.message);
    
    return res.status(401).json({ 
      success: false, 
      message: "Invalid or expired token",
      error: error.message
    });
  }
};