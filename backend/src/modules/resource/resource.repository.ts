import { prisma } from "../../lib/prisma"

export const findResourceById=async({id}:{id:string})=>{
return await prisma.resource.findUnique({where:{id}})
}