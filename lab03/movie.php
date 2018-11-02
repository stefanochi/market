<!DOCTYPE html>
<!-- Stefano Chiavazza
Codice HTML per la pagina TMNT-Rancit Tomatoes -->
<html lang="en">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<link href="movie.css" type="text/css" rel="stylesheet">
		<link rel="shortcut icon" type="image/png" href="http://courses.cs.washington.edu/courses/cse190m/11sp/homework/2/rotten.gif">

		<?php 
			$film = $_GET["film"];
			$info = file("$film/info.txt");
			$overview_contents = file_get_contents("$film/overview.txt");
			$n_reviews = sizeof(glob("$film/review*.txt"));
		?>
		<title><?=$info[0]?></title>
	</head>

	<body>
		<div id="banner">
			<img src="http://www.cs.washington.edu/education/courses/cse190m/11sp/homework/2/banner.png" alt="Rancid Tomatoes" class="banner">
		</div>

		<?php 
			$year = trim($info[1]);
		?>
		<h1><?= "$info[0] ($year)"?></h1>
		<div id="main">
			<div id="info">
				<div>
					<img src="<?=$film?>/overview.png" alt="general overview">
				</div>

				<dl>

				<?php
					$sections = explode("\n", $overview_contents);
					foreach ($sections as $section){
						$section_exp = explode(":", $section);
						$section_title = $section_exp[0];
						$section_content = $section_exp[1];
				?>

						<dt><?=$section_title?></dt>
						<dd><?=$section_content?></dd>
				<?php
					}
				?>
				</dl>
			</div>

			<div id="reviews-div">
				<div id="score">
					<img src="http://www.cs.washington.edu/education/courses/cse190m/11sp/homework/2/rottenbig.png" alt="Rotten" class="rotten-img">
					<?=$info[2]?>%
				</div>

				<?php 
					function display_review($start, $end, $total_reviews){
						global $film;
						for($i=$start; $i<=$end; $i++){
							if($total_reviews >= 10 && $i <10){
								$review_number = "0$i";
							}else{
								$review_number = $i;
							}
							$review = file("$film/review$review_number.txt");
							$review[1] = strtolower($review[1]);
							$review[1] = str_replace("\n", "",$review[1]);
						?>
							<p class='review-text'>
								<img src='http://www.cs.washington.edu/education/courses/cse190m/11sp/homework/2/<?=$review[1]?>.gif' alt=<?=$review[1]?>>
								<q><?=$review[0]?></q>
							</p>
							<p class='review-author'>
								<img src='http://www.cs.washington.edu/education/courses/cse190m/11sp/homework/2/critic.gif' alt='Critic'>
								<?=$review[2]?>
								<br>
								<?=$review[3]?>
							</p>
				<?php
						}	
					}
				?>
				
				<div id="first-column" class="review-column">
					<?php 
						display_review(1, round($n_reviews/2), $n_reviews);
					?>
				</div>
				<div class="review-column">
					<?php 
						display_review(round($n_reviews/2)+1, $n_reviews, $n_reviews);
					?>
				</div>
			</div>
			<div id="page">
					<p>(1-<?= $n_reviews?>) of <?= $n_reviews?></p>
				</div>
		</div>
		<div id="footer">
			<div>
				<a href="ttp://validator.w3.org/check/referer"><img src="http://www.cs.washington.edu/education/courses/cse190m/11sp/homework/2/w3c-xhtml.png" alt="Validate HTML"></a> <br>
				<a href="http://jigsaw.w3.org/css-validator/check/referer"><img src="http://jigsaw.w3.org/css-validator/images/vcss" alt="Valid CSS!"></a>
			</div>
		</div>
	</body>
</html>