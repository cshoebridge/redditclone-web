import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { InputField } from "../../components/InputField";
import { NavBar } from "../../components/NavBar";
import Wrapper from "../../components/Wrapper";
import { useChangePasswordMutation } from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { toErrorMap } from "../../utils/toErrorMap";

interface changePasswordProps {}

const ChangePassword: React.FC<changePasswordProps> = ({}) => {
	const [, changePassword] = useChangePasswordMutation();

	const router = useRouter();
	const token = router.query.token as string;

	return (
		<React.Fragment>
			<NavBar />
			<Wrapper>
				<Formik
					initialValues={{ password: "" }}
					onSubmit={async ({ password }, { setErrors }) => {
						const response = (
							await changePassword({
								token,
								newPassword: password,
							})
						).data!.changePassword;

						if (!response) {
							alert(
								"Unable to change password, redirecting to home page..."
							);
						} else if (!response.success) {
							if (!response.field) {
								alert(response.message);
								alert(
									"Redirecting to 'I forgot my password' page..."
								);
								router.replace("/forgotpassword");
							} else {
								const errors = toErrorMap([
									{
										field: response.field,
										message: response.message,
									},
								]);
								console.log(errors);
								setErrors(errors);
							}
						} else {
							alert(
								"Password changed successfully! Redirecting to login page..."
							);
							router.replace("/login");
						}
					}}
				>
					{({ isSubmitting }) => (
						<Form>
							<Box my={4}>
								<InputField
									name="password"
									placeholder="new password"
									label="New Password"
									type="password"
								/>
							</Box>
							<Button
								mt={1}
								type="submit"
								isLoading={isSubmitting}
								colorScheme="teal"
							>
								Change Password
							</Button>
						</Form>
					)}
				</Formik>
			</Wrapper>
		</React.Fragment>
	);
};

export default withUrqlClient(createUrqlClient)(ChangePassword);
