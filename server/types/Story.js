const Story = /* GraphQL */ `
	# The contents of a story
	type StoryContent {
		title: String!
		description: String
		media: String
	}

	type Story {
		id: ID!
		createdAt: Date!
		modifiedAt: Date!
		frequency: Frequency!
		published: Boolean!
		content: StoryContent!
		deleted: Boolean
		locked: Boolean
		messages: [Message!]
	}

	extend type Query {
		story(id: ID!): Story
	}

	input StoryContentInput {
		title: String!
		description: String
		media: String
	}

	input StoryInput {
		frequency: ID!
		published: Boolean!
		content: StoryContentInput!
	}

	extend type Mutation {
		addStory(story: StoryInput!): Story
		publishStory(id: ID!): Story
		setStoryLock(id: ID!, value: Boolean!): Story
		deleteStory(id: ID!): Boolean
	}
`;

module.exports = Story;
