"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner"; // Assuming you are using Sonner toast

export default function Home() {
  const router = useRouter();
  const [accountType, setAccountType] = useState("customer");
  const [chefSpeciality, setChefSpeciality] = useState("");
  const [loginAccountType, setLoginAccountType] = useState("customer");

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form state
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await fetch(`/api/${loginAccountType}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        const tokenName =
          loginAccountType === "customer" ? "customerToken" : "chefToken";
        setCookie(tokenName, data.token, { maxAge: 60 * 60 }); // 1 hour
        router.push(`/${loginAccountType}`);
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  const handleRegister = async () => {
    try {
      const bodyData =
        accountType === "chef"
          ? {
              name: registerName,
              email: registerEmail,
              password: registerPassword,
              speciality: chefSpeciality,
            }
          : {
              name: registerName,
              email: registerEmail,
              password: registerPassword,
            };

      const res = await fetch(`/api/${accountType}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        const tokenName =
          accountType === "customer" ? "customerToken" : "chefToken";
        setCookie(tokenName, data.token, { maxAge: 60 * 60 }); // 1 hour
        router.push(`/${accountType}`);
      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="flex flex-col gap-8 items-center justify-center min-h-screen p-4 bg-gray-50">
      <h1 className="text-3xl font-bold text-primary mb-2">
        Welcome to <span className="text-orange-500">Pizzurger</span> Store
      </h1>

      <Tabs
        defaultValue="Login"
        className="w-full max-w-md shadow-md rounded-2xl bg-white"
      >
        <TabsList className="grid w-full grid-cols-2 rounded-t-2xl">
          <TabsTrigger value="Login">Login</TabsTrigger>
          <TabsTrigger value="Register">Register</TabsTrigger>
        </TabsList>

        {/* Login Tab */}
        <TabsContent value="Login">
          <Card className="border-0 shadow-none">
            <CardHeader className="text-center">
              <CardTitle>Login</CardTitle>
              <CardDescription>Access your account below</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="example@domain.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="login-password">Password</Label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="login-account-type">Login As</Label>
                <Select
                  value={loginAccountType}
                  onValueChange={setLoginAccountType}
                >
                  <SelectTrigger id="login-account-type">
                    <SelectValue placeholder="Choose account type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="chef">Chef</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleLogin}>
                Sign In
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Register Tab */}
        <TabsContent value="Register">
          <Card className="border-0 shadow-none">
            <CardHeader className="text-center">
              <CardTitle>Create Account</CardTitle>
              <CardDescription>Join the Pizzurger family!</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="register-name">Name</Label>
                <Input
                  id="register-name"
                  type="text"
                  placeholder="John Doe"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="register-email">Email</Label>
                <Input
                  id="register-email"
                  type="email"
                  placeholder="example@domain.com"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="register-password">Password</Label>
                <Input
                  id="register-password"
                  type="password"
                  placeholder="Create a strong password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="account-type">Account Type</Label>
                <Select value={accountType} onValueChange={setAccountType}>
                  <SelectTrigger id="account-type">
                    <SelectValue placeholder="Choose account type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="chef">Chef</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {accountType === "chef" && (
                <div className="space-y-1">
                  <Label htmlFor="chef-speciality">Chef Speciality</Label>
                  <Select
                    value={chefSpeciality}
                    onValueChange={setChefSpeciality}
                  >
                    <SelectTrigger id="chef-speciality">
                      <SelectValue placeholder="Pick your speciality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="veg-pizza">Veg Pizza</SelectItem>
                      <SelectItem value="non-veg-pizza">
                        Non-Veg Pizza
                      </SelectItem>
                      <SelectItem value="burger">Burger</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleRegister}>
                Create Account
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
