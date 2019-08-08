import React from 'react';
import { Dimmer, Loader } from 'semantic-ui-react'

const Spinner = () => (
	<div className="spinner">
		<Dimmer active inverted>
			<Loader size='massive'>Loading</Loader>
		</Dimmer>
	</div>
)

export default Spinner