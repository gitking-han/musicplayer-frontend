import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useMusic } from '@/contexts/MusicContext';
import { useToast } from '@/hooks/use-toast';

const Signup: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useMusic();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Passwords don\'t match',
        description: 'Please make sure your passwords match.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    // Mock registration
    setTimeout(() => {
      const mockUser = {
        id: '1',
        name: formData.name,
        email: formData.email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`,
        playlists: []
      };

      login(mockUser);
      toast({
        title: 'Account created!',
        description: 'Welcome to MusicStream. Start exploring music!',
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
            <h1 className="text-2xl font-bold text-foreground">Create Account</h1>
            <p className="text-muted-foreground">Join millions of music lovers</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-foreground">Full Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 bg-glass/30 border-glass-border backdrop-blur-glass"
                required
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 bg-glass/30 border-glass-border backdrop-blur-glass"
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-foreground">Password</Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleInputChange}
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

            <div>
              <Label htmlFor="confirmPassword" className="text-foreground">Confirm Password</Label>
              <div className="relative mt-1">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="pr-10 bg-glass/30 border-glass-border backdrop-blur-glass"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 rounded border-glass-border"
                required
              />
              <Label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed">
                I agree to the{' '}
                <Link to="/terms" className="text-primary hover:text-primary/80">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-primary hover:text-primary/80">
                  Privacy Policy
                </Link>
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-primary hover:bg-primary/90 shadow-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          {/* Social Signup */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-glass-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-muted-foreground">Or sign up with</span>
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

          {/* Login Link */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-primary hover:text-primary/80 transition-colors font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Signup;