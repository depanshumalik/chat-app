
import fs from 'fs';
import { v4 } from 'uuid';

export async function addMessage(req, res) {
    try {
        console.log('ppppppppppp')
        const { from, to, message } = req.body;




        var messages = [];
        var json;
        fs.readFile('./models/messages.json', 'utf8', function readFileCallback(err, data) {
            if (err) {
                console.log(err);
            } else {
                messages = JSON.parse(data); //now it an object
                console.log('users')
                console.log(messages)
                if (!messages[0] || (messages[0] && messages[messages.length - 1].message.text !== message)) {
                    console.log('usersaa')
                    console.log(messages)
                    messages.push({ id: v4(), message: { text: message }, users: [from, to], sender: from });
                }
                json = JSON.stringify(messages);
                // write it back 
                if (json)
                    fs.writeFile('./models/messages.json', json, 'utf8', (err) => {
                        console.log('aaaa')

                    })


            }
            return res.json({ message: "message sent successfully" })
        });



        // const data = await Message.create({
        //     message: { text: message },
        //     users: [from, to],
        //     sender: from,
        // });

    } catch (error) {
        console.log(error)
        return res.status(400).json({ message: error.message })
    }
};

export async function getAllMessage(req, res) {
    try {
        const { from, to } = req.body;

        console.log(req.params)
        var messages = []
        var allMessages = []
        var json;
        fs.readFile('./models/messages.json', 'utf8', function readFileCallback(err, data) {
            if (err) {
                console.log(err);
            } else {
                messages = JSON.parse(data);

                if (messages[0]) {
                    allMessages = messages.filter(item => (item.users[0] === from && item.users[1] === to) || (item.users[0] === to && item.users[1] === from))
                }

                console.log('allmessages')
                console.log(allMessages)

                const projectMessages = allMessages.map((msg) => {
                    return {
                        fromSelf: msg.sender.toString() === from,
                        message: msg.message.text,
                    };
                });
                console.log(projectMessages)
                res.json(projectMessages);
            }
        });




        // console.log('projectMessages')
        // console.log(projectMessages)
        // res.json(projectMessages);
    } catch (error) {
        console.log('error')
        console.log(error)
        return res.status(400).json({ message: error.message })
    }
};



export const latestMessage = (req, res) => {
    try {
        const { arr, from, to } = req.body;

        console.log('arr')
        console.log(arr)
        console.log(req.params)
        var messages = []
        var allMessages = []
        var json;
        var allLatestMessages = []
        var projectMessages
        fs.readFile('./models/messages.json', 'utf8', function readFileCallback(err, data) {
            if (err) {
                console.log(err);
            } else {

                arr[0] && arr.forEach((person) => {
                    console.log('oooo')
                    messages = JSON.parse(data);
                    if (messages[0]) {
                        allMessages = messages.filter(item => item.users[0] === from && item.users[1] === person._id)
                    }

                    console.log('all Messages')
                    console.log(allMessages)

                    projectMessages = allMessages.map((msg) => {
                        return {
                            fromSelf: msg.sender.toString() === from,
                            message: msg.message.text,
                            to: msg.users[1]
                        };
                    });

                    projectMessages[projectMessages.length - 1] && allLatestMessages.push(projectMessages[projectMessages.length - 1])

                    // console.log(projectMessages[0])
                })

            }
            res.json(allLatestMessages);
        });




        // console.log('projectMessages')
        // console.log(projectMessages)
        // res.json(projectMessages);
    } catch (error) {
        console.log('error')
        console.log(error)
        return res.status(400).json({ message: error.message })
    }
}











export async function accessChat(req, res) {
    try {
        const { userId } = req.body;

        if (!userId) {
            throw new Error("UserId param not sent with request!")
        }

        var isChat = await Chat.find({
            isGroupChat: false,
            $and: [
                { users: { $elemMatch: { $eq: req.user._id } } },
                { users: { $elemMatch: { $eq: userId } } }
            ]
        }).populate("users", "-password")
            .populate("latestMessage");

        isChat = await User.populate(isChat, {
            path: "latestMessage.sender",
            select: "name pic email",
        });


        if (isChat.length > 0) {
            res.send(isChat[0]);
        } else {
            var chatData = {
                chatName: 'sender',
                isGroupChat: false,
                users: [req.user._id, userId],
            }

            try {
                const createdChat = await Chat.create(chatData);

                const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
                    "users",
                    "-password"
                );

                res.status(200).send(fullChat);
            } catch (err) {
                res.send(400).send(err)
            }
        }
    } catch (error) {
        res.status(400).send(error);
    }
}

export async function fetchChat(req, res) {
    try {
        var chats = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 })

        chats = await User.populate(chats, {
            path: "latestMessage.sender",
            select: "name pic email"
        })

        res.status(200).send(chats);
    } catch (err) {
        res.status(400).send(err)
    }
}

export async function createGroupChat(req, res) {
    try {
        if (!req.body.users || !req.body.name) {
            throw new Error("Please fullfill all the fields!")
        }

        const users = JSON.parse(req.body.users);

        if (users.length < 2) {
            throw new Error("More than 2 users are required for group chat!");
        }

        users.push(req.user);

        const groupChat = await Chat({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user,
        });

        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

        res.status(200).json(fullGroupChat)
    } catch (err) {
        res.status(400).json(err)
    }
}

export async function renameGroup(req, res) {
    const { id: _id } = req.params;
    chats.find((e) => e._id === _id) ? res.status(201).send(chats.find((e) => e._id === _id)) : res.status(201).send({ none: "none" })

}

export async function removeFromGroup(req, res) {
    const { id: _id } = req.params;
    chats.find((e) => e._id === _id) ? res.status(201).send(chats.find((e) => e._id === _id)) : res.status(201).send({ none: "none" })

}

export async function addToGroup(req, res) {
    const { id: _id } = req.params;
    chats.find((e) => e._id === _id) ? res.status(201).send(chats.find((e) => e._id === _id)) : res.status(201).send({ none: "none" })

}
