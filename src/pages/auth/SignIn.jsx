import { AlertCircleIcon, Eye, EyeOff } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Alert,
  AlertTitle,
} from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"


export default function SignIn() {
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { isLoggedIn, loginWithEmailAndPassword } = useAuth(); 
  const navigate = useNavigate();
  const formRef = useRef(null);

  useEffect(() => {
    if (isLoggedIn) navigate("/"); 
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);  
    }, 500);  

    return () => clearTimeout(timer);  
  }, []);

  const handlePasswordToggle = () => setShowPassword(prevState => !prevState);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginWithEmailAndPassword(email, password); 
      navigate("/"); 
    } catch (err) {
      setError("Login failed. Please try again");
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gray-100">
      {loading ? (<Spinner className="size-6" />) : ( 
      <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle>Welcome Back</CardTitle>
        <CardDescription>
          Log in to continue to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a
                  href="mailto:namanchaturvedi@hotmail.com?subject=Issue%20Signing%20In"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
              <div className="relative">
              <Input 
                id="password" 
                type={showPassword ? 'text' : 'password'} 
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
              <button
                  type="button"
                  onClick={handlePasswordToggle}
                  className="absolute right-3 top-2 text-gray-800"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
                </div>
            </div>
          </div>
          </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type="button" onClick={() => formRef.current?.requestSubmit()} className="w-full cursor-pointer">
          Login
        </Button>
      </CardFooter>
    </Card>
    )}
    {error && 
    <div className="w-full max-w-sm mt-5">
      <Alert variant="destructive" className="mt-5">
        <AlertCircleIcon />
        <AlertTitle>{error}</AlertTitle>
      </Alert>
    </div>
    }
    </div>
  )
}
