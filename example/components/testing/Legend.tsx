import {
	legendWrapperStyle,
	legendTitleStyle,
	legendGridStyle,
	badgeStyle,
	legendTextStyle,
	legendFooterStyle
  } from '../../styles/testingStyles';
  
  export const Legend = () => (
	<div style={legendWrapperStyle}>
	  <h2 style={legendTitleStyle}>Status Key</h2>
	  <div style={legendGridStyle}>
		<span style={badgeStyle('#888')}>Untested</span>
		<p style={legendTextStyle}>
		  Pending external or restricted access.
		</p>
  
		<span style={badgeStyle('#4caf50')}>Tested</span>
		<p style={legendTextStyle}>
		  Verified routes actively working and community-tested.
		</p>
  
		<span style={badgeStyle('#e53935')}>Failed</span>
		<p style={legendTextStyle}>
		  Library or endpoint issues (not user error).
		</p>
  
		<span style={badgeStyle('#ff9800')}>Testing</span>
		<p style={legendTextStyle}>
		  Feature currently under development on our end.
		</p>
  
		<span style={badgeStyle('#fafafa', '#333')}>Missing</span>
		<p style={legendTextStyle}>
		  Functionality not supported by the provider.
		</p>
	  </div>
  
	  <p style={legendFooterStyle}>
		Every test here updates our database in real time, informing all
		users which routes are working.
	  </p>
	</div>
  );
  