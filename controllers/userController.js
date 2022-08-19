import generateToken from '../config/generateToken.js';
import { v4 } from 'uuid';
import fs from 'fs';


export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    console.log(name, email, password)
    try {

        if (!name || !email || !password)
            throw new Error('Please fill all fields!')

        var users = [];
        var json;
        fs.readFile('./models/users.json', 'utf8', function readFileCallback(err, data) {
            if (err) {
                console.log(err);
            } else {
                users = JSON.parse(data); //now it an object
                console.log('users')
                console.log(users)
                if (!users[0] || (users[0] && users[users.length - 1].email !== email)) {
                    console.log('usersaa')
                    console.log(users)
                    users.push({ _id: v4(), name, email, password, isAvatarImageSet: true, avatar: `https://api.multiavatar.com/45678000/${Math.round(Math.random() * 1000)}.png` });
                }
                json = JSON.stringify(users);
                // write it back 
                if (json)
                    fs.writeFile('./models/users.json', json, 'utf8', (err) => {
                        console.log('aaaa')
                        return
                    })

                return
            }
            return
        });


        // res.status(201).json({
        //     id: users[0].id,
        //     name: users[0].name,
        //     email: users[0].email,
        //     token: generateToken(users[0].id),
        //     message: "User has been registered!"
        // })
    } catch (error) {

        // req.file && fs.unlink(req.file.path, error => { })
        console.log('error')
        console.log(error)
        res.status(400).json({ message: error.message })
    }
};


export const authUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        var users = [];
        var user;
        fs.readFile('./models/users.json', 'utf8', function readFileCallback(err, data) {
            if (err) {
                console.log(err);
            } else {
                users = JSON.parse(data);

                if (users) {
                    users.map((item) => {
                        console.log(item)
                        if (item.email === email) {
                            user = item
                            console.log('itemaaaaaaaaaaaaaaaaaaaa')
                            console.log(password)
                            if (item.password != password) {
                                throw new Error("The password entered is incorrect!")
                            }
                        }
                    })

                    if (!user)
                        throw new Error("This email address is not registered!")
                }



                res.status(201).json({
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    isAvatarImageSet: user.isAvatarImageSet,
                    avatar: user.avatar,
                    message: "User Signed in Sucessfully!",
                    token: generateToken(user.id),
                })

            }
        });

        console.log('users')
        console.log(await users)


    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}


export const setAvatar = async (req, res) => {
    console.log(req.body)
    console.log(req.body.file)
    try {
        if (!req.body.file)
            throw new Error('Avatar not uploaded!')
        console.log('aa')
        const userId = req.params.id;
        const avatar = req.body.file;
        const userData = await User.findByIdAndUpdate(userId, {
            isAvatarImageSet: true,
            avatar
        }, { new: true });
        console.log(userData)
        return res.json({
            isSet: userData.isAvatarImageSet,
            image: userData.avatar
        })
    } catch (err) {
        console.log(err)
        return res.status(400).json({ message: err.message })
    }
}


export const allUsers = async (req, res) => {
    console.log('aaa')
    // const keyword = req.query.search && {
    //     $or: [
    //         { name: { $regex: req.query.search, $options: "i" } },
    //         { email: { $regex: req.query.search, $options: "i" } }
    //     ]
    // };
    // const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    try {
        // const users = await User.find({ _id: { $ne: req.params.id } }).select([
        //     "email",
        //     "name",
        //     "avatar",
        //     "_id"
        // ]);
        console.log(req.params)
        var users = []
        var allUsers = []
        var json;
        fs.readFile('./models/users.json', 'utf8', function readFileCallback(err, data) {
            if (err) {
                console.log(err);
            } else {
                users = JSON.parse(data);

                if (users[0]) {
                    allUsers = users.filter(item => item._id !== req.params.id)
                }

                console.log('allUsers')
                console.log(allUsers)

                return res.json(allUsers);
            }
        });


    } catch (err) {
        return res.status(400).json({ message: err.message })
    }

}

