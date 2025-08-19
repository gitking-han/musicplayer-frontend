import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useMusic } from '@/contexts/MusicContext';
import { useToast } from '@/hooks/use-toast';

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useMusic();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock authentication
    setTimeout(() => {
      const mockUser = {
        id: '1',
        name: 'Music Lover',
        email: email,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
        playlists: []
      };

      login(mockUser);
      toast({
        title: 'Welcome back!',
        description: 'You have been successfully logged in.',
      });
      navigate('/');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md bg-gradient-glass backdrop-blur-glass border-glass-border shadow-elevated">
        <div className="p-8 space-y-6">
          {/* Logo */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="h-12 w-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-primary">
                <Music className="h-6 w-6 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to continue listening</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 bg-glass/30 border-glass-border backdrop-blur-glass"
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-foreground">Password</Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10 bg-glass/30 border-glass-border backdrop-blur-glass"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="rounded border-glass-border"
                />
                <Label htmlFor="remember" className="text-sm text-muted-foreground">
                  Remember me
                </Label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:text-primary/80 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-primary hover:bg-primary/90 shadow-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Social Login */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-glass-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="border-glass-border bg-glass/30">
              Google
            </Button>
            <Button variant="outline" className="border-glass-border bg-glass/30">
              Spotify
            </Button>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="text-primary hover:text-primary/80 transition-colors font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Login;