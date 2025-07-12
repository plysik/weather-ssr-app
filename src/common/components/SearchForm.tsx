import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import cn from "clsx";
import { Search } from "lucide-react";
// biome-ignore lint/style/useImportType: <explanation>
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const SearchForm: React.FC = () => {
	const navigate = useNavigate();
	const { city: paramCity } = useParams<{ city: string }>();

	// Decode city param for display, or empty string on home page
	const decodedParam = paramCity ? decodeURIComponent(paramCity) : "";

	// Local state: initialize from URL param if present
	const [city, setCity] = useState<string>(decodedParam);

	// Whenever the URL param changes, update the input value
	useEffect(() => {
		setCity(decodedParam);
	}, [decodedParam]);

	const onSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const name = city.trim();
		if (!name) return;
		navigate(`/${encodeURIComponent(name)}`);
	};

	return (
		<form
			onSubmit={onSubmit}
			className="flex w-full max-w-md mx-auto p-4 space-x-2"
		>
			<div className="relative flex-1">
				<Search
					className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-900 z-1"
					size={20}
				/>
				<Input
					value={city}
					onChange={(e) => setCity(e.target.value)}
					placeholder="Wpisz miasto"
					className={cn("pl-10 w-full bg-white text-gray-900")}
				/>
			</div>
			<Button
				type="submit"
				className="whitespace-nowrap bg-indigo-900 hover:cursor-pointer"
			>
				Szukaj
			</Button>
		</form>
	);
};

export default SearchForm;
