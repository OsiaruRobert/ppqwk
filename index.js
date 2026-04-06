// Express application
import express from "express";
import mongoose from "mongoose";
import "dotenv/config";

//Users in DB
const userSchema = new mongoose.Schema(
 {
  //Normal account info
  username: {
   type: String,
   unique: [true, "Username aleady taken."],
   required: [true, "Please choose a username"],
   trim: true,
   minlength: [3, "Username must be at least 3 characters"],
   maxlength: [50, "Username is too long (max 50 characters)"],
   match: [
    /^[a-zA-Z0-9_]+$/,
    "Username can only contain letters, numbers, and underscores"
   ]
  },
  gmail: {
   type: String,
   required: [true, "Please enter your Gmail address"],
   unique: [
    true,
    "This gmail already has an account. Please login or close the account. You can ask admin to close the account"
   ],
   trim: true,
   lowercase: true,
   maxlength: [100, "Email is too long"],
   match: [
    /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
    "Please enter a valid Gmail address"
   ]
  },
  phone: {
   type: String,
   unique: [
    true,
    "This phone number already has account. Please login or close the account. You can ask admin to close the account"
   ],
   required: [true, "Please enter your phone number"],
   trim: true,
   match: [/^\d{10}$/, "Phone number must be 10 digits (9117624343)"]
  },
  avatar: {
   type: String,
   default: "avatar1"
  },
  //studentInfo
  studentInfo: {
   faculty: {
    type: String,
    required: [true, "Please input your faculty"],
    maxlength: [200, "faculty is too long, Use the common abbrevation"]
   },
   department: {
    type: String,
    required: [true, "Please input your department"],
    maxlength: [200, "department is too long, Use the common abbrevation"]
   },

   matno: {
    type: String,
    required: [true, "Please input your Mat. No"],
    maxlength: [16, "Mat. No is too long"]
   },

   views: [
    {
     sessionid: String,
     date: {
      type: Date,
      default: Date.now
     },
     balance: Number,
     item: String
    }
   ],
   uploads: [
    {
     sessionid: String,
     date: {
      type: Date,
      default: Date.now
     },
     balance: Number,
     itemId: String
    }
   ],

   verified: {
    type: Boolean
   },

   banned: {
    type: Boolean
   }
  },
  //sensetive info
  sensetive: {
   accessToken: {
    value: {
     type: String,
     unique: [true, "Something went wrong on our server. Please try again"],
     required: true
    },
    expires: {
     type: Date
    }
   },
   sessionid: {
    value: {
     type: String,
     unique: [true, "Something went wrong on our server. Please try again"],
     required: true
    },
    expires: {
     type: Date
    }
   },
   otp: {
    value: {
     type: String,
     match: [/^\d{6}$/, "OTP must be 6 digits"]
    },
    expires: {
     type: Date
    }
   },
   password: {
    value: {
     type: String,
     required: [true, "Please create a password"],
     minlength: [6, "Password must be at least 6 characters"]
    },
    trails: [
     {
      date: {
       type: Date,
       default: Date.now
      },
      input: {
       type: String
      }
     }
    ]
   }
  },

  //wallet info
  wallet: {
   balance: {
    type: Number,
    default: 0,
    min: [0, "Balance cannot be negative"]
   },
   fake_balance: {
    type: Number,
    default: 100,
    min: [0, "Balance cannot be negative"]
   },
   address: {
    type: String
   }
  },
  transactions: [
   {
    type: {
     type: String,
     required: true
    },
    cost: {
     type: Number,
     required: true,
     min: [1, "Amount is 1"]
    },
    description: String,
    status: {
     type: String,
     enum: ["pending", "success", "failed"],
     default: "pending"
    },
    date: {
     start: { type: String },
     verified: { type: String, default: null }
    },
    new_balance: {
     type: Number,
     default: 0,
     min: [0, "Balance cannot be negative"]
    },
    old_balance: {
     type: Number,
     default: 0,
     min: [0, "Balance cannot be negative"]
    },
    transactionid: {
     type: String
    },
    sessionid: {
     type: String
    }
   }
  ],

  referral: {
   type: String,
   default: "none",
   trim: true,
   validate: {
    validator: function (value) {
     return value === "none" || /^[a-zA-Z0-9_]{3,50}$/.test(value);
    },
    message: "Invalid referral code"
   }
  },
  referrals: [
   {
    type: String,
    trim: true,
    match: [/^[a-zA-Z0-9_]{3,50}$/, "Invalid username format"]
   }
  ],
  signins: [
   {
    date: {
     type: Date,
     default: Date.now
    },
    sessionid: {
     type: String,
     default: "None"
    },
    ip: String,
    userAgent: String
   }
  ]
 },
 {
  timestamps: true
 }
);
const User = mongoose.model("User", userSchema);

//transaction in DB
const transactionSchema = new mongoose.Schema({
 userTransaction: {
  type: {
   type: String,
   required: true
  },
  cost: {
   type: Number,
   required: true,
   min: [0, "Amount cannot be negative"]
  },
  description: String,
  status: {
   type: String,
   enum: ["pending", "success", "failed"],
   default: "pending"
  },
  date: {
   initiated: {
    type: Date,
    default: Date.now
   },
   verified: {
    type: Date,
    default: null
   }
  },
  new_balance: {
   type: Number,
   default: 0,
   min: [0, "Balance cannot be negative"]
  },
  old_balance: {
   type: Number,
   default: 0,
   min: [0, "Balance cannot be negative"]
  }
 },
 gmail: {
  type: String
 },
 transactionid: {
  type: String
 },
 sessionid: {
  type: String
 }
});
const Gtransactions = mongoose.model("transactions", transactionSchema);

//Shares in DB
const sharesSchema = new mongoose.Schema(
 {
  gmail: {
   type: String,
   required: [true, "Please enter your Gmail address"],
   unique: [
    true,
    "This gmail already has an account. Please login or close the account. You can ask admin to close the account"
   ],
   trim: true,
   lowercase: true,
   maxlength: [100, "Email is too long"],
   match: [
    /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
    "Please enter a valid Gmail address"
   ]
  },
  //wallet info
  shares: {
   type: Number
  },

  account: {
   bank_name: {
    type: String
   },

   account_number: {
    type: String
   },

   account_name: {
    type: String
   }
  },

  wallet: {
   type: String
  },

  transactions: [
   {
    type: {
     type: String,
     required: true
    },
    status: {
     type: String,
     enum: ["pending", "success", "failed"],
     default: "pending"
    },
    amount: {
     type: Number,
     required: true,
     min: [1, "Amount is 1"]
    },
    transactionid: {
     type: String
    },
    date: {
     initiated: {
      type: Date,
      default: Date.now
     },
     verified: {
      type: Date,
      default: null
     }
    }
   }
  ]
 },
 {
  timestamps: true
 }
);
const Shares = mongoose.model("Shares", sharesSchema);

//connect to database
async function connectDB() {
 const Mongodb_url = process.env.DB_URL;
 //DB_URL
 await mongoose.connect(Mongodb_url).then(() => console.log("connected"));
}

function getDateOnly(locale = "en-US", options = {}) {
 return new Intl.DateTimeFormat(locale, {
  year: "numeric",
  month: "long",
  day: "numeric",
  ...options
 }).format(new Date());
}
// Example output: "November 15, 2023"

function getTimeOnly(locale = "en-US", options = {}) {
 return new Intl.DateTimeFormat(locale, {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  ...options
 }).format(new Date());
}
// Example output: "02:30:45 PM"

// Express initiation
const app = express();
app.use(express.json());

app.use(
(req, res, next) => {
  // Allow requests from any origin
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  // Allow specific methods
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  
  // Allow specific headers
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  
  next();
});


// home page route
app.post("/", (req, res) => {
 console.log(req.body);
 let sss = req.body;
 sss.reply = "I am ok";
 res.json({
  okay: true,
  reply: "see me"
 });
});

//Increase tokens
async function increaseTokens(gmail, amount, notes, ref) {
 try {
  //get user
  let user = await User.findOne({ gmail: gmail });
  if (!user) throw new Error(`User ${gmail} not found`);

  //Find transactions not our still.

  //Increase balance
  user.wallet.balance = user.wallet.balance + amount;

  //Save transactions
  const trans = {
   type: "funding",
   cost: amount,
   description: notes,
   status: "success",
   date: {
    start: Date.now,
    verified: null
   },
   new_balance: user.wallet.balance,
   old_balance: user.wallet.balance - amount,
   transactionid: ref,
   sessionid: user.sensetive.sessionid.value
  };

  user.transactions.push(trans);
  await user.save();

  //save global
  const gt = {
   userTransaction: {
    type: "funding",
    cost: amount,
    description: notes,
    status: "success",
    date: {
     start: Date.now(),
     verified: null
    },
    new_balance: user.wallet.balance,
    old_balance: user.wallet.balance - amount
   },
   gmail: user.gmail,
   transactionid: ref,
   sessionid: user.sensetive.sessionid.value
  };

  const gti = new Gtransactions(gt);
  await gti.save();

  return true;
 } catch (error) {
  console.error(`Error in deductTokens for ${gmail}:`, error);
  throw error;
 }
}

//Increase tokens
async function buyShares(gmail, amount, ref) {
 try {
  amount = Number(amount);
console.log(`Buy ${amount} shares for ${gmail}`)
console.log(`Finding admin`)
  //get admin
  let admin = await Shares.findOne({ gmail: "ppqadmin@gmail.com" });
  if (!admin) throw new Error(`admin ppqadmin@gmail.com not found`);
  admin.shares = admin.shares - amount;
const  adminTrans = {
   type: "buy",
   status: "pending",
   amount: amount,
   transactionid: ref,
   date: {
    initial: Date.now(),
    verified: Date.now()
   }
  };
  admin.transactions.unshift(adminTrans);
  admin.save();
console.log(`found and tax admin`)


console.log(`Finding buyer`)
  //get user
  let user = await User.findOne({ gmail: gmail });
  if (!user) throw new Error(`User ${gmail} not found`);
console.log(`found buyer`)


console.log(`Finding shares`)
  //Find share holder
  let shareHolder = await Shares.findOne({ gmail: gmail });
  if (!shareHolder) throw new Error(`shareHolder not found`);
console.log(`found shares`)


console.log(`Finding shareHolderTrans`)
  //Increase balance
  const shareHolderTrans = shareHolder.transactions;
  for (let i = 0; i < shareHolderTrans.length; i++) {
   let trans = shareHolderTrans[i];
   if (trans.transactionid === ref) {
    shareHolderTrans[i].status = "success";
    shareHolderTrans[i].date.verified = Date.now();
    shareHolder.shares = shareHolder.shares + amount;
    console.log(`found shareHolderTran`)

    return;
   }
  }
  await shareHolderTrans.save();

  //Save transactions to user
  console.log(`save to user`)
  const trans = {
   type: "buy shares",
   cost: amount,
   description: `Bought ${amount} Shares`,
   status: "success",
   date: {
    start: Date.now(),
    verified: Date.now()
   },
   new_balance: user.wallet.balance,
   old_balance: user.wallet.balance,
   transactionid: ref,
   sessionid: user.sensetive.sessionid.value
  };
  user.transactions.push(trans);
  await user.save();


  console.log(`save to global`)
  //save global
  const gt = {
   userTransaction: {
    type: "Buy shares",
    cost: amount,
    description: `Bought ${amount} Shares`,
    status: "success",
    date: {
     start: Date.now(),
     verified: Date.now()
    },
    new_balance: user.wallet.balance,
    old_balance: user.wallet.balance
   },
   gmail: user.gmail,
   transactionid: ref,
   sessionid: user.sensetive.sessionid.value
  };

  const gti = new Gtransactions(gt);
  await gti.save();

  console.log(`all good`)

  return true;
 } catch (error) {
  console.error(`Error in deductTokens for ${gmail}:`, error);
  throw error;
 }
}

app.post("/Buying", async (req, res) => {
 try {
  console.log(req.body);

  //Extract values
  if (req.body.event === "charge.success") {
   const payDetails = req.body.data.metadata.guide;
   const gmail = payDetails.email;
   const amount = Number(payDetails.amount);

   if (payDetails.command === "buyshares") {
    await buyShares(gmail, amount, req.body.data.reference);
   } else {
    await increaseTokens(
     gmail,
     amount,
     `Bought ${amount} PPQ coins`,
     req.body.data.reference
    );
   }

   res.send("done");
  } else {
   console.log("Failure ProjectPQuniport@gmail.com");
   console.log(req.body);

   res.send("Allgood");
  }
 } catch (err) {
  console.log(`We noticed ${err.message}`);
  res.send(`We noticed ${err.message}`);
 }
});

app.use((req, res) => {
 res.send(true);
});

// start server
app.listen(process.env.PORT, async () => {
 try {
  await connectDB();
  console.log(`Our app is listening`);
 } catch (err) {
  console.log(err.message);
  console.log(`Our app is not listening`);
 }
});
