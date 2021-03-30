import React from "react";
import { Form, Formik } from "formik";
import { Button, Box } from "@chakra-ui/react";
import Wrapper from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { useRegisterMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
	const router = useRouter();
	const [, register] = useRegisterMutation();
	return (
		<Wrapper>
			<Formik
				initialValues={{ username: "", email: "", password: "" }}
				onSubmit={async (values, { setErrors }) => {
					const response = await register(values);
					if (response.data?.register.errors) {
						const errors = toErrorMap(
							response.data.register.errors
						);
						setErrors(errors);
					} else if (response.data?.register.user) {
						//register success!
						router.push("/");
					}
				}}
			>
				{({ isSubmitting }) => (
					<Form>
						<Box my={4}>
							<InputField
								name="username"
								placeholder="username"
								label="Username"
							/>
							<InputField
								name="email"
								placeholder="email"
								label="Email Address"
							/>
							<InputField
								name="password"
								placeholder="password"
								label="Password"
								type="password"
							/>
							
						</Box>
						<Button
							mt={4}
							type="submit"
							isLoading={isSubmitting}
							colorScheme="teal"
						>
							Register
						</Button>
					</Form>
				)}
			</Formik>
		</Wrapper>
	);
};

export default withUrqlClient(createUrqlClient)(Register);
