export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Check if organizer is approved
    if (req.user.role === "organizer" && req.user.status !== "approved") {
      return res.status(403).json({ 
        message: "Your organizer account is pending approval. Please wait for admin approval.",
        status: req.user.status
      });
    }
    
    next();
  };
};
