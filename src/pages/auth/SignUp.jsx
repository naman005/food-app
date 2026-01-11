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
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

export default function SignUp() {
  const [loading, setLoading] = useState(true);
  const { isLoggedIn, signupUserWithEmailAndPassword } = useAuth(); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
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
    if (password !== confirmPassword) {
      setError("Passwords don't match. Please try again.");
      return;
    }
    setError("");
    try {
      await signupUserWithEmailAndPassword(email, password); 
      toast.success("Account created! Log in to complete setup.");
      setTimeout(() => {
        navigate("/r/signin");
      }, 2000);
    } catch (err) {
      setError("Signup failed. Please try again.");
    }
  };
    return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gray-100">
    {loading ? (<Spinner className="size-6" />) : (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle>Get Started Today</CardTitle>
        <CardDescription>
          Create an account and get started
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
              <Label htmlFor="password">Password</Label>
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
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input 
                id="confirm-password" 
                type={showPassword ? 'text' : 'password'} 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required 
              />
            </div>
          </div>
          </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button 
          type="button"  
          className="w-full cursor-pointer"
          disabled={password !== confirmPassword}
          onClick={() => formRef.current?.requestSubmit()}
        >
          Create Account
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
