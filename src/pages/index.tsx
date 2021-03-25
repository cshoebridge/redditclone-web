import { withUrqlClient } from "next-urql";
import React from "react";
import { NavBar } from "../components/NavBar";
import Wrapper from "../components/Wrapper";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

const Index = () => {
	const [{ data, fetching }] = usePostsQuery();
	return (
		<React.Fragment>
			<NavBar />
			<Wrapper>
				{fetching || !data
					? <div>Loading...</div>
					: data.posts.map((post) => (
							<div>
								<p key={post.id}>{post.title}</p>
								<br></br>
							</div>
					  ))}
			</Wrapper>
		</React.Fragment>
	);
};

export default withUrqlClient(createUrqlClient, {ssr: true})(Index);
