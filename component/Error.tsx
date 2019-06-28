import * as React from 'react'
import { Box, Color } from 'ink'

export default function Error({ children }:any) {
	return (
		<Box>
			<Color red>{children}</Color>
		</Box>
	)
}
