Feature: Creating a PDF Study Guide
  User wants to upload pdfs and attachments to combine into a sngle pdf study guide

  @browser
  Scenario: Create guide with no attachments
    Given User has a pdf and no images
    When User creates a pdf study guide
    Then User should have a pdf study guide with no additional pages/modifications
