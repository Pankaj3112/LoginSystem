const User = require('../models/user');

module.exports.home = async function(req, res){
    try{
        if(req.isAuthenticated()){
            return res.render('home', {
                title: "Home",
            }); 
        }

        let user = await User.findById(req.user);
        return res.render('home', {
            title: "Home",
            user: user
        }); 
    }  
    catch(err){
        console.log('Error in rendering homepage --->', err);
        return;
    }
};
