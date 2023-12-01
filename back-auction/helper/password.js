import bcryptjs, { hash } from 'bcrypt'

export const hashedPassword= async (password)=>{
    try {
     const saltRound = 10;
     const hashedpassword= await bcryptjs.hash(password, saltRound) 
     return hashedpassword
    } catch (error) {
        console.log(error)
        
    }
}

export const comparePassword= async (password, hashedPassword)=>{
    return bcryptjs.compare(password, hashedPassword)
}