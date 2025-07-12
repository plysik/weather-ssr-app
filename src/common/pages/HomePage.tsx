import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader } from "@components/ui/card";
import { MapPin } from "lucide-react";
// biome-ignore lint/style/useImportType: <explanation>
import React from "react";
import { Link } from "react-router-dom";
import SearchForm from "../components/SearchForm";

const popularCities = ["Warszawa", "Kraków", "Gdańsk", "Wrocław"];

const HomePage: React.FC = () => {
	return (
		<div className="min-h-screen flex flex-col">
			<header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-20">
				<div className="container mx-auto text-center">
					<h1 className="text-4xl font-extrabold mb-4">
						Sprawdź pogodę w swojej okolicy
					</h1>
					<p className="mb-8 text-lg opacity-90">
						Aktualna i przyszła prognoza dla wybranego miasta, plus porównanie z
						największymi metropoliami.
					</p>
					<div className="max-w-lg mx-auto">
						<SearchForm className="bg-white bg-opacity-60 backdrop-blur-sm" />
					</div>
				</div>
			</header>
			<section className="flex-1 bg-gray-50 py-12">
				<div className="container mx-auto">
					<h2 className="text-2xl font-semibold text-center mb-6">
						Popularne miasta
					</h2>
					<div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
						{popularCities.map((city) => (
							<Card
								key={city}
								className="hover:shadow-lg transition-shadow hover:cursor-pointer"
							>
								<CardContent className="flex flex-col items-center p-6">
									<MapPin size={32} className="text-indigo-500 mb-2" />
									<Link to={`/${encodeURIComponent(city)}`}>
										<Button
											variant="outline"
											className="w-full hover:cursor-pointer"
										>
											{city}
										</Button>
									</Link>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>
		</div>
	);
};

export default HomePage;
