import { useEffect, useState } from "react"
import UserAuctions from "@/components/UserProfile/UserAuctions"
import UserPrevHistory from "@/components/UserProfile/UserPrevHistory"
import { UserOwningAuctions } from "@/components/UserProfile/UserOwningAuctions"
import { UserInfo, UserInfoShort } from "@/components/UserProfile/UserInfo"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Activity, Package, UserCircle } from "lucide-react"
import { toast } from "sonner"
import { useSelector } from "react-redux"

const Profile = () => {
  const [activeTab, setActiveTab] = useState("participating");
  const [user,setUser]=useState({status:false, points:null,auctionbid:null,auctionwin:null});


 
  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl text-white/75 font-bold tracking-tight">Profile Dashboard</h1>
          <p className=" text-white/75">Manage your account and view your auction activities</p>
          <Separator className="my-2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6">

          <div className="flex flex-col space-y-4">
            <ProfileNavigation activeTab={activeTab} onChange={(value) => setActiveTab(value)} />

            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Account Overview</CardTitle>
                {/* <CardDescription>Your account information</CardDescription> */}
              </CardHeader>
              <CardContent className=''>
                <UserInfoShort />
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle>
                  {activeTab === "user" && "User Information"}
                  {activeTab === "owning" && "Auctions You Own"}
                  {activeTab === "participating" && "Auctions You're Participating In"}
                </CardTitle>
                <CardDescription>
                  {activeTab === "user" && "Your personal information and settings"}
                  {activeTab === "owning" && "Manage auctions you've created"}
                  {activeTab === "participating" && "Track auctions you've bid on"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {activeTab === "user" && <UserInfo />}
                {activeTab === "participating" && <UserAuctions />}
                {activeTab === "owning" && <UserOwningAuctions />}
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle>Auction History</CardTitle>
                <CardDescription>Your past auction activities</CardDescription>
              </CardHeader>
              <CardContent>
                <UserPrevHistory />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile

function ProfileNavigation({ activeTab, onChange }) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle>Navigation</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex flex-col">
          <ProfileNavItem
            icon={<UserCircle className="mr-2 h-5 w-5" />}
            label="User Profile"
            value="user"
            isActive={activeTab === "user"}
            onClick={() => onChange("user")}
          />
          <ProfileNavItem
            icon={<Package className="mr-2 h-5 w-5" />}
            label="My Auctions"
            value="owning"
            isActive={activeTab === "owning"}
            onClick={() => onChange("owning")}
          />
          <ProfileNavItem
            icon={<Activity className="mr-2 h-5 w-5" />}
            label="Participating"
            value="participating"
            isActive={activeTab === "participating"}
            onClick={() => onChange("participating")}
          />
        </div>
      </CardContent>
    </Card>
  )
}

function ProfileNavItem({ icon, label, value, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center px-4 py-3 text-sm font-medium transition-colors hover:bg-muted/50 ${isActive ? "bg-muted text-primary border-l-4 border-primary" : "text-muted-foreground"
        }`}
    >
      {icon}
      {label}
    </button>
  )
}
