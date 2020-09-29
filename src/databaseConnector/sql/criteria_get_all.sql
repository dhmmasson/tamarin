SELECT criteria.name
     , min( data.value ) AS min
     , max( data.value ) AS max
     , criteria.description 
	 , sortingorder_name AS sortingorder
FROM criteria
	JOIN criteria_has_sortingorder ON criteria.name = criteria_has_sortingorder.criteria_name
  LEFT JOIN data ON data.criteria_name = criteria.name 
WHERE type_name LIKE 'numeric'
GROUP BY criteria.name 
	
