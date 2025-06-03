import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
	return (
		<div className="flex items-center justify-center min-h-screen bg-muted">
			<Card className="w-full max-w-sm">
				<CardHeader>
					<CardTitle className="text-xl">Login</CardTitle>
				</CardHeader>
				<CardContent>
					<form className="space-y-4">
						<Input type="email" placeholder="Email" />
						<Input type="password" placeholder="Password" />
						<Button type="submit" className="w-full">
							Sign In
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
