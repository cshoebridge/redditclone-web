import { FormControl, FormLabel, Input, FormErrorMessage, Textarea } from "@chakra-ui/react";
import { useField } from "formik";
import React, { InputHTMLAttributes } from "react";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> & {
    label: string;
	name: string;
	variant?: "field" | "area"
};

export const InputField: React.FC<InputFieldProps> = ({label, size: _, variant = "field", ...props}) => {
	let TextBox;
	switch(variant) {
		case "area":
			TextBox = Textarea
			break;
		default:
			TextBox = Input;
	}
	const [field, {error}] = useField(props);
	return (
		<FormControl isInvalid={!!error}>
			<FormLabel htmlFor={field.name}>{label}</FormLabel>
			<TextBox {...field} {...props} id={field.name}/>
			{error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
		</FormControl>
	);
};
