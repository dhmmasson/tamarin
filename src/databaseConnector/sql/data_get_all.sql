SELECT technology_name AS technology
     , description
     , criteria_name   AS criteria
     , value
FROM    data
  JOIN  technology ON data.technology_name = technology.name 
