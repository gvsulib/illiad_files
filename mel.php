 <?php
 header("Access-Control-Allow-Origin: *");
 date_default_timezone_set('America/Detroit'); // Set to Eastern Time


 // Let's record another RefWorks export

 function saveData($list, $file) {

	$fp = fopen($file, 'a');

    	fputcsv($fp, $list);

	fclose($fp);
}

$current_date = date("m-d-Y");
$current_time = date("ga");
$record_number = $_REQUEST['no'];

$lists_array = array($current_date, $current_time, $record_number);

saveData($lists_array, '/var/www/prod/labs/illiad/mel.csv');