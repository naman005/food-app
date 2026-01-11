import { useEffect, useRef } from "react"
import { toJpeg } from "html-to-image"
import QRCode from "react-qr-code"
import { AlertDialogBox } from "../../components/AlertDialogBox"
import { Card } from "@/components/ui/card"
import { useNavigate, NavLink } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { useRestaurant } from "@/context/RestaurantContext"
import { EmptyState } from "@/components/EmptyState"
import { Spinner } from "@/components/ui/spinner"
import { resetDailyTokenIfNeeded } from "@/utils/resetDailyToken"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CopyIcon, FullscreenIcon, QrCodeIcon } from "lucide-react"
import { Dialog, DialogTrigger, DialogTitle , DialogContent } from "@/components/ui/dialog"
import { toast } from "sonner"

export default function Home() {
  const { restaurantId, loadingRestaurant } = useRestaurant();
  const { logout } = useAuth(); 
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!restaurantId) return

    resetDailyTokenIfNeeded(restaurantId)
  }, [restaurantId]);

  const handleLogout = () => {
    logout(); 
    navigate("/r/signin");  
  }

  const enterFullscreen = () => {
  const el = document.documentElement
    if (el.requestFullscreen) el.requestFullscreen()
  }
  
  return (
  <div className="flex flex-col items-center justify-center min-h-screen">
    {loadingRestaurant ? (<Spinner className="size-6" />) :  !restaurantId ? 
    (<EmptyState
        className="flex items-center justify-center"
        onSetup={() => navigate("/r/onboard")}
        onCancel={handleLogout}
      />) : (<>
        <div className="absolute top-5 right-5 space-x-5">
          <Button variant="outline" onClick={enterFullscreen}><FullscreenIcon /></Button>
          <RestaurantQR restaurantId={restaurantId} />
        </div>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mx-auto max-w-5xl">
    <NavLink to="/r/menu">
    <Card className="home-card">Organise Menu</Card>
    </NavLink>
    <NavLink to="/r/kitchen">
    <Card className="home-card">Order Dashboard</Card>
    </NavLink>
    <NavLink to="/r/token">
    <Card className="home-card">Token Queue</Card>
    </NavLink>
    <AlertDialogBox 
      title="Exit All Sessions?"
      description="This action will log you out of all active sessions, including the kitchen and token display."
      onAction={handleLogout}
    >
    <Card className="home-card">Log Out</Card>
    </AlertDialogBox>
  </div>
  </>
  )}
  </div>
  )
}

function RestaurantQR({ restaurantId }) {
  const url = `${window.location.origin}/c/${restaurantId}`;
  const qrRef = useRef(null);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    toast("Copied to clipboard");
  }

  const downloadQR = async () => {
  if (!qrRef.current) return;

  try {
    const dataUrl = await toJpeg(qrRef.current, {
      quality: 0.95,
      backgroundColor: "#ffffff",
    });

    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "restaurant-qr.jpg";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("QR code downloaded");
  } catch (error) {
    console.error(error);
    toast.error("Failed to download QR");
  }
  };


  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline"><QrCodeIcon /></Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] text-center">
        <DialogTitle>Scan to View Menu</DialogTitle>
        <div className="flex flex-col items-center space-y-6 p-6">
        
        <div ref={qrRef} className="bg-white p-4 rounded-xl">
          <QRCode value={url} size={220} />
        </div>

        <div className="relative w-full">
        <Input 
          id="url" 
          type="url"
          value={url}
          disabled
        />
        <Button variant="secondary" onClick={handleCopy} className="absolute right-0 cursor-pointer">
          <CopyIcon />
        </Button>
        </div>
        <Button onClick={downloadQR} className="w-full cursor-pointer">Download QR</Button>
        </div>
      </DialogContent>
    </Dialog>
    
  )
}
