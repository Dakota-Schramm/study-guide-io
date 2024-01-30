Feature: Creating a PDF Study Guide
  User wants to upload pdfs and attachments to combine into a sngle pdf study guide

  @browser @integration @stem
  Scenario: Create guide with no attachments
    When User creates a study guide with a pdf and no images
    Then User should have a pdf study guide with no additional pages/modifications

  @browser @integration @stem
  Scenario: Create guide with one attachment
    When User creates a study guide with a pdf and one image
    Then User should have a pdf study guide with one additional page
