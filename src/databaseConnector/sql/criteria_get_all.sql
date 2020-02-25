SELECT criteria.name
     , min( data.value ) AS min
     , max( data.value ) AS max
FROM criteria
  LEFT JOIN data ON data.criteria_name = criteria.name
WHERE type_name = 'numeric'
GROUP BY criteria.name
