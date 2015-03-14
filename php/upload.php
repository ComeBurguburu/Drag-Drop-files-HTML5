<?php
$folder = "temp/";
if(isset($_FILES['files']))
{
	for($i=0;$i<count($_FILES['files']['name']);$i++)
	{
		if(move_uploaded_file($_FILES['files']['tmp_name'][$i],'../'.$folder.basename($_FILES['files']['name'][$i]))){
			echo ' upload success :'.$folder.basename($_FILES['files']['name'][$i]).'<br/>';
		}else{
			echo "error: upload failed";
		}
	}
}
else
{
	echo "wrong name attribut";
}