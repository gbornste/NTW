"use server"

// This is a simulated news API that would normally fetch from a real news source
// In a production app, you would integrate with a real news API

export interface Headline {
  id: string
  title: string
  excerpt: string
  date: string
  category: string
  image: string
  content?: string
  source?: string
}

// Sample headlines database - in a real app this would come from an API
const headlinesDatabase: Headline[] = [
  {
    id: "news1",
    title: "Trump's Latest Policy Proposal Faces Widespread Criticism from Experts",
    excerpt:
      "Policy experts from across the political spectrum have raised concerns about the feasibility and potential consequences of Trump's latest proposal.",
    date: "May 12, 2025",
    category: "Politics",
    image: "/placeholder.svg?height=200&width=300",
    source: "The Washington Post",
    content: `
      <p>WASHINGTON — Former President Donald Trump's latest policy proposal, unveiled during a rally in Ohio last week, has drawn sharp criticism from policy experts across the political spectrum.</p>
      
      <p>The proposal, which would drastically reduce federal funding for environmental protection while simultaneously increasing military spending by an estimated $200 billion, has been described as "fiscally irresponsible" and "environmentally catastrophic" by leading economists and environmental scientists.</p>
      
      <p>"This proposal represents a fundamental misunderstanding of both economic and environmental realities," said Dr. Eleanor Simmons, a senior fellow at the Brookings Institution. "The numbers simply don't add up, and the environmental impact would be devastating."</p>
      
      <p>Republican policy experts have also expressed concerns. "While I support strong military funding, this proposal goes too far in sacrificing other essential government functions," said Richard Thornton, who served as an economic advisor in the Bush administration. "There needs to be a more balanced approach."</p>
      
      <p>The Congressional Budget Office has yet to score the proposal, but preliminary analyses from independent think tanks suggest it would increase the federal deficit by approximately $1.3 trillion over ten years.</p>
      
      <p>Environmental groups have been particularly vocal in their opposition. "This would effectively dismantle decades of environmental protections," said Sierra Club President Maria Rodriguez. "The consequences for air quality, water safety, and climate change mitigation would be severe and long-lasting."</p>
      
      <p>Despite the criticism, Trump has doubled down on the proposal, claiming it would "make America strong again" and create jobs in the defense sector.</p>
      
      <p>Public polling on the issue shows limited support, with only 28% of Americans expressing approval for the plan in a recent Gallup survey.</p>
    `,
  },
  {
    id: "news2",
    title: "Fact Check: Trump Makes 12 False Claims During Recent Rally Speech",
    excerpt:
      "Our fact-checking team analyzed Trump's recent rally speech and identified a dozen demonstrably false or misleading statements.",
    date: "May 11, 2025",
    category: "Legal",
    image: "/placeholder.svg?height=200&width=300",
    source: "PolitiFact",
    content: `
      <p>ATLANTA — During his rally speech in Atlanta on Tuesday, former President Donald Trump made at least 12 false or misleading claims, according to our comprehensive fact-check analysis.</p>
      
      <p>The 90-minute speech, delivered to a crowd of approximately 8,000 supporters, contained numerous inaccuracies on topics ranging from election security to economic statistics and immigration policy.</p>
      
      <h3>Economy and Jobs</h3>
      
      <p>Trump claimed that unemployment reached its "lowest level in history" during his presidency. In fact, while unemployment did reach a 50-year low of 3.5% before the pandemic, this was not the lowest in U.S. history. The rate dropped to 2.5% in 1953.</p>
      
      <p>He also stated that his administration created "the greatest economy ever seen." Economic growth during his pre-pandemic presidency averaged 2.5% annually, which is solid but below the growth rates seen during several previous administrations.</p>
      
      <h3>Immigration</h3>
      
      <p>Trump claimed that "no illegal immigrants" crossed the southern border during his final year in office. Border Patrol data shows approximately 400,000 unauthorized border crossings were recorded in 2020.</p>
      
      <p>He also stated that "all" immigrants currently crossing the border are "violent criminals." Department of Homeland Security data indicates that less than 1% of migrants have serious criminal records.</p>
      
      <h3>Election Claims</h3>
      
      <p>Trump repeated his claim that the 2020 election was "stolen" through "massive fraud." This claim has been rejected by more than 60 courts, his own Justice Department, and election officials from both parties.</p>
      
      <p>He also claimed that voting machines in Georgia were "rigged" to change votes. Multiple audits, including hand recounts, have confirmed the accuracy of the machine counts.</p>
      
      <h3>Foreign Policy</h3>
      
      <p>Trump claimed that North Korea has "resumed nuclear testing" since he left office. No nuclear tests have been detected by international monitoring agencies since 2017.</p>
      
      <p>He also stated that he "eliminated ISIS completely." While the territorial caliphate was largely dismantled during his administration, ISIS continued to operate as an insurgency and has since regained strength in parts of Syria and Iraq.</p>
      
      <p>The remaining false claims pertained to healthcare policy, COVID-19 statistics, and his legal cases.</p>
      
      <p>When reached for comment, Trump campaign spokesperson Jennifer Miller said the former president was "speaking figuratively" and accused the media of "nitpicking."</p>
    `,
  },
  {
    id: "news3",
    title: "Economists Warn Trump's Proposed Tax Plan Would Increase National Debt",
    excerpt:
      "Leading economists have analyzed the proposed tax plan and concluded it would significantly increase the national debt while primarily benefiting the wealthy.",
    date: "May 10, 2025",
    category: "Economy",
    image: "/placeholder.svg?height=200&width=300",
    source: "The New York Times",
    content: `
      <p>NEW YORK — A panel of leading economists has issued a stark warning about former President Donald Trump's recently proposed tax plan, concluding it would add approximately $4.8 trillion to the national debt over the next decade while disproportionately benefiting the wealthiest Americans.</p>
      
      <p>The analysis, published by the nonpartisan Tax Policy Center, examined the details of Trump's proposal, which includes reducing the corporate tax rate from 21% to 15%, eliminating the estate tax entirely, and creating new capital gains tax exemptions.</p>
      
      <p>"This plan would represent one of the largest upward redistributions of wealth in modern American history," said Dr. Jonathan Fielding, the center's director. "About 78% of the tax benefits would flow to the top 1% of earners."</p>
      
      <p>The report estimates that households earning more than $1 million annually would receive an average tax cut of approximately $250,000, while middle-class families would see an average reduction of just $1,200.</p>
      
      <p>Perhaps most concerning to fiscal conservatives is the projected impact on the national debt. "Even using dynamic scoring that accounts for potential economic growth, this plan would add nearly $5 trillion to the debt over ten years," said former Congressional Budget Office director Douglas Elmendorf. "That's simply not sustainable."</p>
      
      <p>Several prominent Republican economists have expressed concern about the proposal. "While I support tax cuts in principle, they need to be fiscally responsible," said Glenn Hubbard, who served as chairman of the Council of Economic Advisers under President George W. Bush. "This plan goes too far in reducing revenue without corresponding spending cuts."</p>
      
      <p>Trump has defended the plan, arguing it would stimulate economic growth and job creation. "These tax cuts will pay for themselves through explosive economic growth," he said at a campaign event in Michigan last week. "We'll see numbers like you've never seen before."</p>
      
      <p>However, the Tax Policy Center analysis suggests that even under optimistic growth projections, the plan would still add trillions to the debt.</p>
      
      <p>"We've heard the 'tax cuts pay for themselves' claim before, and it has consistently been proven false," said Nobel Prize-winning economist Paul Krugman. "This is magical thinking, not sound economic policy."</p>
    `,
  },
  {
    id: "news4",
    title: "Trump's Environmental Rollbacks: The Long-Term Impact",
    excerpt:
      "Environmental scientists assess the lasting damage of Trump-era environmental policy rollbacks and what it means for climate change efforts.",
    date: "May 9, 2025",
    category: "Environment",
    image: "/placeholder.svg?height=200&width=300",
    source: "National Geographic",
    content: `
      <p>BOSTON — A comprehensive new study from researchers at MIT and Harvard has quantified the long-term environmental impact of regulatory rollbacks implemented during the Trump administration, concluding that these policy changes will result in an additional 1.8 billion metric tons of greenhouse gas emissions by 2035 if not reversed.</p>
      
      <p>The peer-reviewed study, published in the journal Nature Climate Science, examined the cumulative effect of more than 100 environmental rule changes enacted between 2017 and 2021.</p>
      
      <p>"What we found was alarming," said lead researcher Dr. Sarah Chen. "These rollbacks have set back U.S. climate progress by approximately seven years, making it significantly more difficult to meet our Paris Agreement commitments."</p>
      
      <p>The study identified the weakening of vehicle emission standards as particularly consequential, accounting for approximately 40% of the projected additional emissions. The relaxation of methane leak regulations for oil and gas operations ranked second, contributing about 25% of the excess emissions.</p>
      
      <p>Beyond climate impacts, the research also documented significant public health consequences. "We project an additional 120,000 premature deaths over the next two decades due to increased air pollution resulting from these regulatory changes," said co-author Dr. James Wilson.</p>
      
      <p>The economic costs are substantial as well. The study estimates that climate-related damages from the additional emissions will total approximately $280 billion, primarily from increased flooding, agricultural losses, and extreme weather events.</p>
      
      <p>Former Trump administration officials have defended their environmental record. "We balanced environmental protection with economic growth and energy independence," said former EPA Administrator Andrew Wheeler in response to the study. "These researchers are using worst-case scenarios that don't reflect reality."</p>
      
      <p>However, current EPA officials have expressed concern about the findings. "This research underscores the urgency of not just restoring previous environmental protections, but strengthening them," said EPA Administrator Michael Regan.</p>
      
      <p>The study concludes that while some damage is irreversible, prompt regulatory action could still prevent approximately 65% of the projected additional emissions.</p>
      
      <p>"The window for effective action is closing rapidly," warned Dr. Chen. "Every year of delay makes the climate challenge substantially more difficult and expensive to address."</p>
    `,
  },
  {
    id: "news5",
    title: "Former Trump Administration Officials Speak Out in New Tell-All Book",
    excerpt:
      "A new book featuring interviews with former Trump administration officials reveals concerning details about decision-making processes during his presidency.",
    date: "May 8, 2025",
    category: "Politics",
    image: "/placeholder.svg?height=200&width=300",
    source: "The Atlantic",
    content: `
      <p>WASHINGTON — A bombshell new book featuring interviews with 27 former Trump administration officials paints a disturbing picture of chaos, incompetence, and ethical breaches at the highest levels of government during Donald Trump's presidency.</p>
      
      <p>"Inside the Storm: The Trump White House Revealed," written by Pulitzer Prize-winning journalist Rebecca Harwood, will be published next week by Random House. The Washington Post obtained an advance copy and published excerpts on Wednesday.</p>
      
      <p>The book includes on-the-record accounts from several high-ranking officials, including two former Cabinet secretaries and multiple White House advisors who have not previously spoken publicly about their experiences.</p>
      
      <p>"There was no functional policy process whatsoever," said one former Cabinet secretary who requested anonymity. "Major decisions affecting millions of Americans were made based on whatever the president had seen on Fox News that morning or whatever the last person in the room had told him."</p>
      
      <p>Former White House Chief of Staff John Kelly, who has become increasingly critical of Trump since leaving the administration, provided several alarming anecdotes. In one instance, Kelly claims Trump suggested selling Puerto Rico after Hurricane Maria because the territory was "costing us too much money to rebuild."</p>
      
      <p>The book also details Trump's alleged attempts to use the Justice Department against political enemies. "He would regularly demand that we investigate specific Democrats," said a former DOJ official. "When told that there was no evidence of wrongdoing, he would become enraged and accuse us of disloyalty."</p>
      
      <p>Multiple officials described Trump's concerning approach to foreign policy. "He was obsessed with how world leaders perceived him personally, not with advancing American interests," said a former National Security Council member. "Policy decisions were made based on which foreign leader had flattered him most recently."</p>
      
      <p>The book also reveals that several Cabinet members discussed invoking the 25th Amendment to remove Trump from office following the January 6th Capitol riot, getting closer to action than was previously known.</p>
      
      <p>Trump spokesperson Taylor Johnson dismissed the book as "fiction" written by "disgruntled former employees with axes to grind." However, the author notes that she corroborated all major claims with multiple sources and extensive documentation.</p>
      
      <p>Pre-orders for "Inside the Storm" have already pushed it to the top of Amazon's bestseller list ahead of its May 15th release date.</p>
    `,
  },
  {
    id: "news6",
    title: "Analysis: Trump's Foreign Policy Legacy and Its Continuing Impact",
    excerpt:
      "International relations experts analyze how Trump's approach to foreign policy continues to affect America's standing in the global community.",
    date: "May 7, 2025",
    category: "International",
    image: "/placeholder.svg?height=200&width=300",
    source: "Foreign Policy Magazine",
    content: `
      <p>LONDON — Four years after Donald Trump left office, his foreign policy legacy continues to reshape America's role in the world, according to a comprehensive new analysis by the Council on Foreign Relations.</p>
      
      <p>The 180-page report, titled "America Adrift: The Lasting Impact of the Trump Doctrine," draws on interviews with over 100 diplomats, foreign policy experts, and government officials from 40 countries to assess how Trump's approach to international relations has altered the global order.</p>
      
      <p>"What we found is that the damage to American credibility and influence has been more lasting than many predicted," said Richard Haass, president of the Council on Foreign Relations and one of the report's authors. "There's a fundamental trust deficit that hasn't been repaired."</p>
      
      <p>The report identifies several key areas where Trump's policies continue to reverberate:</p>
      
      <h3>Alliances</h3>
      
      <p>Traditional U.S. allies, particularly in Europe and Asia, have accelerated efforts to reduce their dependence on American security guarantees. NATO countries have increased defense spending but also invested in European-only security arrangements. Japan and South Korea have expanded their own military capabilities while hedging their relationships with China.</p>
      
      <p>"The fear that the U.S. could again elect a president hostile to alliances has fundamentally changed how these countries approach their security," said former NATO Secretary General Jens Stoltenberg, who was interviewed for the report.</p>
      
      <h3>Climate Change</h3>
      
      <p>The U.S. withdrawal from the Paris Climate Agreement (though later rejoined) created lasting skepticism about American commitment to climate action. "Other countries now build 'America-proofing' into climate agreements, creating mechanisms that can survive potential U.S. withdrawal," the report notes.</p>
      
      <h3>International Institutions</h3>
      
      <p>Trump's hostility toward organizations like the UN, WHO, and WTO accelerated the creation of alternative institutions where American influence is limited. China has successfully expanded its role in global governance, filling vacuums left by U.S. disengagement.</p>
      
      <p>"The Chinese-led Regional Comprehensive Economic Partnership, which excludes the United States, is now the world's largest trading bloc," the report points out. "This would have been unthinkable before Trump withdrew from the Trans-Pacific Partnership."</p>
      
      <p>The report concludes that while some damage has been repaired, the fundamental nature of American leadership has been permanently altered.</p>
      
      <p>"The era of unquestioned American hegemony is over," Haass said. "Future presidents will face a more multipolar world where U.S. leadership is neither assumed nor automatically accepted."</p>
      
      <p>Trump's foreign policy team has pushed back against the report's conclusions. "President Trump restored respect for America on the world stage through strength and principled realism," said former Secretary of State Mike Pompeo. "The current global instability stems from the current administration's weakness, not President Trump's policies."</p>
    `,
  },
  {
    id: "news7",
    title: "Trump's Legal Team Files Motion to Dismiss Latest Lawsuit",
    excerpt:
      "Legal analysts weigh in on the likelihood of success for Trump's motion to dismiss the latest in a series of lawsuits against him.",
    date: "May 6, 2025",
    category: "Legal",
    image: "/placeholder.svg?height=200&width=300",
    source: "Reuters",
    content: `
      <p>NEW YORK — Attorneys representing former President Donald Trump filed a motion on Monday to dismiss the latest lawsuit against him, arguing that the case lacks merit and is politically motivated.</p>
      
      <p>The lawsuit, filed by New York Attorney General Letitia James, alleges that Trump and his business associates engaged in a pattern of fraudulent practices, including manipulating asset valuations to obtain favorable loan terms and tax benefits.</p>
      
      <p>In the 45-page motion to dismiss, Trump's legal team characterized the lawsuit as "a transparent attempt to score political points" and argued that the statute of limitations has expired for many of the alleged violations.</p>
      
      <p>"This case represents an unprecedented overreach by the Attorney General's office," said Trump attorney Alina Habba in a statement. "The transactions in question were between sophisticated private parties and were fully vetted by legal and financial professionals."</p>
      
      <p>Legal experts, however, are skeptical about the motion's chances of success.</p>
      
      <p>"The motion raises some legitimate procedural questions, but the core allegations involve serious financial improprieties that fall squarely within the Attorney General's jurisdiction," said Rebecca Roiphe, a former prosecutor and professor at New York Law School. "I would be surprised if the case were dismissed entirely at this stage."</p>
      
      <p>The lawsuit seeks $250 million in penalties and a permanent ban on Trump and his three oldest children from serving as officers or directors of any New York-based company.</p>
      
      <p>This is just one of several legal challenges facing the former president. He is currently defending himself in four separate civil lawsuits and remains under investigation in Georgia for his attempts to overturn the 2020 election results in that state.</p>
      
      <p>"Trump's legal strategy has consistently been to delay proceedings through procedural maneuvers," noted former federal prosecutor Barbara McQuade. "This motion appears to be part of that same playbook."</p>
      
      <p>Judge Arthur Engoron, who is presiding over the case, has scheduled a hearing on the motion for June 15. Legal analysts expect him to allow at least some portions of the case to proceed to trial.</p>
      
      <p>"The evidence presented in the initial filing was quite detailed and specific," said McQuade. "That typically makes it harder to get a case dismissed before trial."</p>
      
      <p>Trump has consistently denied any wrongdoing and has characterized all legal actions against him as part of a "witch hunt" by his political opponents.</p>
    `,
  },
  {
    id: "news8",
    title: "Poll Shows Declining Support for Trump Among Key Demographics",
    excerpt:
      "A new nationwide poll indicates Trump's support is waning among several key demographic groups that were crucial to his previous campaigns.",
    date: "May 5, 2025",
    category: "Politics",
    image: "/placeholder.svg?height=200&width=300",
    source: "Gallup",
    content: `
      <p>WASHINGTON — A comprehensive new poll conducted by the Pew Research Center shows former President Donald Trump's support declining significantly among key demographic groups that were crucial to his previous political campaigns.</p>
      
      <p>The nationwide survey of 12,000 registered voters, one of the largest political polls conducted this year, reveals particularly steep drops in support among suburban women, seniors, and non-college-educated white voters.</p>
      
      <p>Among suburban women, Trump's approval rating has fallen to 34%, down from 42% in 2020 and 48% in 2016. With voters over 65, his support has dropped to 41%, compared to 52% in the 2020 election.</p>
      
      <p>Perhaps most concerning for Trump's political future is the erosion of support among white voters without college degrees, long considered his most loyal base. While he still maintains majority support in this group at 52%, this represents a significant decline from the 64% support he received from this demographic in 2020.</p>
      
      <p>"What we're seeing is a gradual but consistent weakening of Trump's coalition," said Dr. Michael Dimock, president of the Pew Research Center. "The demographics that propelled him to the presidency are showing signs of Trump fatigue."</p>
      
      <p>The poll identified several factors driving this shift. Among suburban women, 58% cited Trump's rhetoric and behavior as their primary concern. For seniors, healthcare policy and Social Security concerns were paramount, with 62% expressing disapproval of Trump's proposed changes to Medicare.</p>
      
      <p>Economic factors appear to be driving the shift among working-class white voters. "Many of these voters haven't seen the economic benefits that were promised," explained Dimock. "About 47% said they were financially worse off now than they were four years ago."</p>
      
      <p>Republican strategists acknowledge the challenge these numbers present. "These are warning signs that can't be ignored," said GOP consultant Sarah Mitchell, who is not affiliated with Trump's campaign. "Winning back these voters will require a more disciplined message focused on kitchen-table economic issues."</p>
      
      <p>Trump campaign spokesperson Jason Miller disputed the poll's findings, calling them "completely disconnected from the enthusiasm we're seeing on the ground." He added, "The silent majority stands firmly behind President Trump and will deliver a historic victory."</p>
      
      <p>Independent political analysts, however, view the numbers as significant. "These aren't just small fluctuations within the margin of error," said elections expert Nate Silver. "These are substantial shifts that, if they hold, would make Trump's electoral path much more difficult."</p>
      
      <p>The poll has a margin of error of +/- 1.2 percentage points.</p>
    `,
  },
  {
    id: "news9",
    title: "Trump's Social Media Platform Faces Technical and Financial Challenges",
    excerpt:
      "Industry experts point to ongoing technical issues and financial hurdles that could threaten the viability of Trump's social media venture.",
    date: "May 4, 2025",
    category: "Technology",
    image: "/placeholder.svg?height=200&width=300",
    source: "TechCrunch",
    content: `
      <p>SAN FRANCISCO — Truth Social, the social media platform launched by former President Donald Trump, is facing significant technical and financial challenges that threaten its long-term viability, according to industry analysts and recent SEC filings.</p>
      
      <p>The platform, which was launched as an alternative to mainstream social networks that had banned Trump, has struggled to maintain reliable service and attract a broad user base beyond the former president's most devoted supporters.</p>
      
      <p>"The technical infrastructure simply isn't robust enough to support a major social network," said Marcus Brennan, a tech analyst at Wedbush Securities. "Users report frequent outages, slow loading times, and basic functionality issues that should have been resolved months ago."</p>
      
      <p>These technical problems have contributed to disappointing user growth. While Trump Media & Technology Group, the platform's parent company, claimed to have 5 million registered users in its most recent quarterly report, independent analytics firms estimate that only about 1.2 million users are active on a monthly basis.</p>
      
      <p>"For context, Twitter has approximately 350 million monthly active users, and even smaller platforms like Parler at its peak had around 15 million," noted social media analyst Casey Newton. "Truth Social isn't achieving the scale necessary to be commercially viable."</p>
      
      <p>The platform's financial situation appears equally precarious. SEC filings reveal that the company lost $73 million in the last fiscal year while generating only $3.8 million in revenue, primarily from advertising.</p>
      
      <p>"The business model isn't sustainable," said Katherine Wood, a financial analyst specializing in tech companies. "Major advertisers are staying away due to brand safety concerns, and the subscription model they've attempted to implement has seen very low conversion rates."</p>
      
      <p>The company's stock price has reflected these challenges, falling more than 60% from its peak shortly after going public through a SPAC merger. Several class-action lawsuits have been filed by shareholders alleging misleading statements about the company's prospects.</p>
      
      <p>Adding to the platform's troubles, key executives have departed in recent months, including the chief technology officer and head of advertising sales.</p>
      
      <p>"There's been a concerning level of executive turnover," said Brennan. "It's difficult to execute a turnaround strategy with such instability in leadership."</p>
      
      <p>Trump, who serves as chairman of Trump Media & Technology Group, has publicly maintained optimism about the platform's future. "Truth Social is doing tremendously well," he posted recently. "The fake news media doesn't want to report on our incredible success."</p>
      
      <p>However, sources familiar with the matter told CNN that Trump has privately expressed frustration with the platform's performance and has been exploring options to either restructure the company or seek additional funding.</p>
      
      <p>"Without a significant capital infusion or strategic partnership, it's difficult to see a path forward for Truth Social as a viable competitor in the social media landscape," concluded Wood.</p>
    `,
  },
  {
    id: "news10",
    title: "Investigation Reveals Trump Organization's Questionable Business Practices",
    excerpt:
      "A comprehensive investigation has uncovered a pattern of concerning business practices within the Trump Organization spanning several decades.",
    date: "May 3, 2025",
    category: "Business",
    image: "/placeholder.svg?height=200&width=300",
    source: "ProPublica",
    content: `
      <p>NEW YORK — A year-long investigation by ProPublica and The New York Times has uncovered extensive evidence of questionable business practices within the Trump Organization spanning more than three decades, including potential tax avoidance, insurance fraud, and misleading statements to financial institutions.</p>
      
      <p>The investigation, based on thousands of pages of internal documents and interviews with 48 former employees, paints a picture of a company that routinely engaged in financial maneuvers that experts say may have crossed legal and ethical boundaries.</p>
      
      <p>"What emerges is a consistent pattern of behavior where the Trump Organization would present different valuations of the same assets to different parties depending on what was financially advantageous at the time," said David Barstow, the Pulitzer Prize-winning investigative reporter who led the project.</p>
      
      <p>Among the most significant findings:</p>
      
      <ul>
        <li>The Trump Organization allegedly maintained two sets of financial records for several properties, with one showing higher valuations for potential lenders and another showing lower valuations for tax authorities.</li>
        <li>Insurance applications for multiple Trump properties allegedly contained significant misrepresentations about the properties' conditions and values.</li>
        <li>The company reportedly used a complex web of shell companies to hide certain transactions from financial scrutiny.</li>
        <li>Several former employees described a corporate culture that encouraged "aggressive" accounting practices and valued loyalty over compliance.</li>
      </ul>
      
      <p>The investigation focused particularly on Trump Tower in Manhattan, Trump National Golf Club in Westchester County, and the Trump International Hotel in Washington, D.C., finding similar patterns across all three properties.</p>
      
      <p>"For Trump Tower, documents show the company told tax authorities the property was worth $168 million, while simultaneously telling Deutsche Bank it was worth $527 million when seeking a loan," Barstow explained.</p>
      
      <p>Legal experts who reviewed the findings expressed concern about potential violations of tax and banking laws.</p>
      
      <p>"These discrepancies go well beyond aggressive accounting or creative tax planning," said Barbara Roper, a former director of investor protection at the Consumer Federation of America. "If accurate, these practices could constitute fraud."</p>
      
      <p>The Trump Organization issued a statement strongly denying the allegations, calling the investigation "a politically motivated hit job based on stolen documents and disgruntled former employees."</p>
      
      <p>Alan Garten, general counsel for the Trump Organization, said all valuations were prepared by independent professionals and that different valuations for different purposes are standard practice in real estate.</p>
      
      <p>"Every transaction was fully vetted by top law firms, major real estate companies, and the largest financial institutions in the world," Garten said. "There was absolutely nothing improper about any of these transactions."</p>
      
      <p>The findings have been shared with federal and state authorities, who declined to comment on whether they would pursue investigations based on the new information.</p>
    `,
  },
  {
    id: "news11",
    title: "Trump's Healthcare Plan Criticized by Medical Professionals",
    excerpt:
      "Leading healthcare experts and medical associations have expressed serious concerns about Trump's proposed healthcare reforms.",
    date: "May 2, 2025",
    category: "Healthcare",
    image: "/placeholder.svg?height=200&width=300",
    source: "The New England Journal of Medicine",
    content: `
      <p>CHICAGO — Former President Donald Trump's newly released healthcare proposal has drawn sharp criticism from medical professionals and healthcare policy experts, who warn it could leave millions of Americans without adequate coverage while increasing costs for vulnerable populations.</p>
      
      <p>The 24-page plan, unveiled at a campaign event in Florida last week, calls for repealing remaining portions of the Affordable Care Act, converting Medicaid to block grants to states, and expanding short-term health plans that don't have to cover pre-existing conditions.</p>
      
      <p>"This proposal would take us backward, not forward," said Dr. Patrice Harris, former president of the American Medical Association. "It would dismantle protections for patients with pre-existing conditions and potentially leave millions without access to affordable care."</p>
      
      <p>The American Academy of Family Physicians, representing 127,600 family doctors across the country, issued a statement expressing "grave concerns" about the plan's impact on patient care.</p>
      
      <p>"As physicians who provide comprehensive care to patients of all ages, we cannot support a proposal that would reduce access to preventive services, make coverage unaffordable for those with chronic conditions, and increase administrative burdens on an already strained healthcare system," the statement read.</p>
      
      <p>Healthcare economists have also questioned the financial assumptions underlying the plan. An analysis by the Commonwealth Fund estimates that the proposal would increase the number of uninsured Americans by 18 to 23 million while raising premiums for older Americans by as much as 25%.</p>
      
      <p>"The math simply doesn't add up," said Dr. Ashish Jha, dean of the Brown University School of Public Health. "You cannot simultaneously reduce federal healthcare spending by $800 billion, as this plan proposes, while maintaining or improving coverage and care quality. Something has to give, and unfortunately, it's usually patient care."</p>
      
      <p>Particularly controversial is the plan's approach to pre-existing conditions. While Trump has repeatedly claimed his plan would protect people with pre-existing conditions, healthcare policy experts note that the expansion of short-term plans would effectively create a two-tiered system.</p>
      
      <p>"These short-term plans can deny coverage based on medical history or charge much higher rates to people with pre-existing conditions," explained Larry Levitt, executive vice president for health policy at the Kaiser Family Foundation. "Saying you support protecting pre-existing conditions while promoting these plans is contradictory."</p>
      
      <p>Trump has defended his plan, arguing it would increase competition and lower costs. "Our plan will give Americans more choices, better care, and lower prices," he said during the announcement. "The current system is broken, and we're going to fix it."</p>
      
      <p>However, even some conservative health policy experts have expressed reservations. "While I support market-based reforms, this proposal lacks specific mechanisms to ensure affordable coverage for vulnerable populations," said Avik Roy, president of the Foundation for Research on Equal Opportunity and a former advisor to Republican politicians.</p>
      
      <p>The healthcare industry itself appears divided, with pharmaceutical companies and some hospital groups expressing cautious support for portions of the plan, while insurers have raised concerns about market stability.</p>
      
      <p>Public polling shows limited enthusiasm for the proposal, with only 34% of Americans expressing support in a recent Gallup survey.</p>
    `,
  },
  {
    id: "news12",
    title: "Trump's Education Policies: A Four-Year Impact Assessment",
    excerpt:
      "Education researchers evaluate the lasting effects of Trump-era education policies on America's public education system.",
    date: "May 1, 2025",
    category: "Education",
    image: "/placeholder.svg?height=200&width=300",
    source: "Education Week",
    content: `
      <p>WASHINGTON — A comprehensive new study from the National Education Policy Center has assessed the long-term impact of education policies implemented during the Trump administration, finding mixed results with some concerning trends in public education outcomes.</p>
      
      <p>The 215-page report, titled "After the Storm: Assessing the Impact of Trump-Era Education Policies," analyzed data from all 50 states to evaluate how changes in federal education policy between 2017 and 2021 affected student achievement, school funding equity, and educational access.</p>
      
      <p>"What we found was a significant divergence in outcomes based on state and local factors," said lead researcher Dr. Linda Darling-Hammond, president of the Learning Policy Institute. "Some of the most concerning impacts were in the areas of civil rights enforcement, support for disadvantaged students, and public school funding."</p>
      
      <p>Among the key findings:</p>
      
      <h3>Civil Rights and Equity</h3>
      
      <p>The report documents a 70% decrease in civil rights investigations by the Department of Education's Office for Civil Rights during the Trump administration, with many cases being dismissed without thorough investigation. This reduction in federal oversight has corresponded with increased disparities in disciplinary actions against students of color in districts that were previously under investigation.</p>
      
      <p>"We've seen a troubling resurgence of discriminatory disciplinary practices in some districts where federal oversight was removed," noted co-author Dr. Pedro Noguera, dean of the USC Rossier School of Education.</p>
      
      <h3>School Choice and Funding</h3>
      
      <p>The push for school choice and voucher programs has had mixed results. In states that expanded voucher programs following Trump administration guidance, public school districts experienced an average 8% reduction in funding, while academic outcomes for students using vouchers showed no significant improvement compared to similar students in public schools.</p>
      
      <p>"The data doesn't support the claim that these programs improve overall educational outcomes," said Darling-Hammond. "Instead, we're seeing increased stratification and resource inequities."</p>
      
      <h3>Higher Education</h3>
      
      <p>Changes to higher education regulations, particularly regarding for-profit colleges and student loan forgiveness programs, have had lasting consequences. Student loan debt has increased by 12% since the rollback of certain borrower protections, with default rates rising most sharply among students who attended for-profit institutions.</p>
      
      <p>The report isn't entirely negative, noting some positive developments in career and technical education funding and apprenticeship programs, which have shown promising results in states that effectively implemented them.</p>
      
      <p>Former Education Secretary Betsy DeVos defended her department's record in response to the report. "Our policies empowered families with more educational options and reduced federal overreach into local school decisions," she said in a statement. "True equity comes from giving every child the opportunity to attend a school that meets their needs, not through federal mandates."</p>
      
      <p>Current Education Secretary Miguel Cardona said the report would inform ongoing policy decisions. "This analysis helps us understand which policies need to be reconsidered and where we need to reinvest to ensure every student has access to a quality education," he stated.</p>
      
      <p>The report concludes with recommendations for policymakers, including restoring civil rights enforcement mechanisms, implementing evidence-based approaches to school improvement rather than privatization, and strengthening protections for student loan borrowers.</p>
      
      <p>"The good news is that many of these trends can be reversed with thoughtful policy changes," Darling-Hammond said. "But it will require sustained attention and investment in our public education system."</p>
    `,
  },
]

// Function to get a random subset of headlines to simulate "new" headlines
function getRandomHeadlines(count: number): Headline[] {
  const shuffled = [...headlinesDatabase].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

// Function to get today's date in the format "Month Day, Year"
function getTodayDate(): string {
  const date = new Date()
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export async function fetchLatestHeadlines() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Get 6 random headlines
  const headlines = getRandomHeadlines(6)

  // Update the dates to be recent (today and previous days)
  const today = new Date()

  return {
    headlines: headlines.map((headline, index) => {
      const headlineDate = new Date(today)
      headlineDate.setDate(today.getDate() - index)

      return {
        ...headline,
        date: headlineDate.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
      }
    }),
    lastUpdated: new Date().toLocaleString(),
  }
}

export async function fetchHeadlineById(id: string) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Find the headline with the matching ID
  const headline = headlinesDatabase.find((h) => h.id === id)

  if (!headline) {
    return null
  }

  // Return the headline with today's date
  return {
    ...headline,
    date: new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
  }
}
