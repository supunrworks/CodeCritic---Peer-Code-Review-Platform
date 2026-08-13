import { Heart, MessageCircle, Info } from "lucide-react"
import {
    Avatar,
    AvatarBadge,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"



function CardImage() {
    return (
        <div>
            <Card className='mx-50 mt-10'>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                            <AvatarFallback>CN</AvatarFallback>
                            <AvatarBadge className="bg-green-600 dark:bg-green-800" />
                        </Avatar>
                        <CardTitle>Max Codes</CardTitle>
                        <CardDescription>1 hour ago</CardDescription>
                    </div>
                    <CardAction><Info /></CardAction>
                </CardHeader>
                <CardContent>
                    <p>Card Content</p>
                </CardContent>
                <CardFooter className='flex gap-4'>
                    <Heart color="#c8ff00" /> <MessageCircle color="#c8ff00" />
                </CardFooter>
            </Card>
        </div>
    )
}

export default CardImage