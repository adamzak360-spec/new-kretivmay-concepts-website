import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function SignUp({ onToggleMode }: { onToggleMode: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  
  const signUpMutation = trpc.auth.signUp.useMutation({
    onSuccess: () => {
      toast.success("Account created successfully! Please sign in.");
      onToggleMode();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create account");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signUpMutation.mutate({ email, password, name });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Create an Account</CardTitle>
        <CardDescription>
          Join Blue Water Shopping Village today.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input 
              id="name" 
              placeholder="John Doe" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="name@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              minLength={6}
            />
            <p className="text-xs text-slate-500">Must be at least 6 characters.</p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button className="w-full" type="submit" disabled={signUpMutation.isPending}>
            {signUpMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Account
          </Button>
          <div className="text-center text-sm text-slate-500">
            Already have an account?{" "}
            <button 
              type="button" 
              className="text-blue-600 hover:underline font-medium"
              onClick={onToggleMode}
            >
              Sign In
            </button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
